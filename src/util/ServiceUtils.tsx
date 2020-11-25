import child_process from 'child_process';

const regexSuccess = /^(service).*(installed|removed|started)$/;

export const RunServiceBat = (path: string, cb: (msg: string) => void) => {
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
                    console.log('Service may have been removed already, continuing...');
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
                let str: string = `Child exited with code ${code}`;
                cb(str);
                if (code !== 0) {
                    reject(str);
                }
            });

            bat.on('error', function(err) {
                reject(err.message);
            });

        } catch(uncaughtException) {
            reject(uncaughtException);
        }

    });
};