import child_process from 'child_process';
import logger from 'electron-log';

const regexSuccess = /^(service).*(installed|removed|started)$/;

export const RunService = (path: string, cb: () => void) => {
    return new Promise((resolve, reject) => {
        const spawn = child_process.spawn;
        const bat = spawn(path);
        
            bat.stdout.on('data', (data) => {
                let str: string = String.fromCharCode.apply(null, data);
                cb();
                logger.info(str);

                let strLower = str.trim().toLowerCase();
                if (strLower.indexOf('not removed') > -1) {
                    logger.info('Service may have been removed already, continuing...');
                    bat.kill();
                    resolve('Continue');
                } else if (strLower.indexOf('not installed') > -1) {
                    bat.kill();
                    reject(str);
                } else if (regexSuccess.test(strLower)) {
                    bat.kill();
                    resolve('Success');
                }
            });

            bat.stderr.on('data', (data) => {
                let str = String.fromCharCode.apply(null, data);
                cb();
                logger.info(str);                                
                if (str.toLowerCase().indexOf('error') > -1 || str.toLowerCase().indexOf('cannot find the path') > -1) {
                    bat.kill();
                    reject(str);
                }
            });

            bat.on('error', function (err) {
                const NO_SUCH_FILE_OR_DIRECTORY_ABBR = 'uninstallService.bat ENOENT';
                if (err.message.indexOf(NO_SUCH_FILE_OR_DIRECTORY_ABBR) > -1) {
                    logger.info('Service file/directory may have been removed already, do not reject');
                    bat.kill();
                    resolve('Continue');
                } else {
                    bat.kill();
                    reject(err.message);
                }
            });

            bat.on('exit', (code) => {
                let str: string = code ? `Process exited with code ${code}` : `Process exited`;
                logger.info(str);
                if (code && code !== 0) {
                    reject(str);
                } 
            });

    });
};