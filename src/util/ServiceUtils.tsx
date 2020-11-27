import child_process from 'child_process';
import logger from 'electron-log';

const regexSuccess = /^(service).*(installed|removed|started)$/;

export const RunService = (path: string, cb: (msg: string) => void) => {
    return new Promise( (resolve, reject) => {
        const spawn = child_process.spawn;
        const bat = spawn(path);
        
        try {
            bat.stdout.on('data', (data) => {
                let str: string = String.fromCharCode.apply(null, data);
                cb(str);
                let strLower = str.trim().toLowerCase();
                if (regexSuccess.test(strLower) && strLower.indexOf('not removed') == -1) {
                    resolve('Success');
                    bat.kill();                    
                } else if (strLower.indexOf('not removed') > -1) {
                    logger.log('Service may have been removed already, continuing...');
                    resolve('Success');
                    bat.kill();                    
                }
            });

            bat.stderr.on('data', (data) => {
                let str = String.fromCharCode.apply(null, data);
                cb(str);
                if (str.toLowerCase().indexOf('error') > -1 || str.toLowerCase().indexOf('cannot find the path') > -1) {
                    reject(str);
                }
            });

            bat.on('exit', (code) => {
                let str: string = code ? `Process exited with code ${code}` : `Process exited`;
                cb(str);
                if (code !== 0) {
                    reject(str);
                }
            });

            bat.on('error', function(err) {
                logger.error(err.message);
                reject(err.message);
            });

        } catch(uncaughtException) {
            logger.error('Exception occurred:', uncaughtException);
            reject(uncaughtException);
        }

    });
};