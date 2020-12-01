import Path from 'path';
import fs from 'fs';
import countFiles from 'count-files';
import StreamZip from 'node-stream-zip';

export const getTotalFileCount = (path: string): Promise<number> => {
    return new Promise((resolve) => {
        countFiles(path, function (err: any, results: any) {
            if (results) {
                resolve(results.files);
            } else {
                resolve(0);
            }            
        });
    });
};

const afs = fs.promises;
export const deleteFolderRecursive = async (path: string, cb: (filename: string) => void ) => {
    if (fs.existsSync(path)) {
        for (let entry of await afs.readdir(path)) {
            const curPath = Path.join(path, entry);
            if ((await afs.lstat(curPath)).isDirectory()) {
                await deleteFolderRecursive(curPath , cb);
            } else {
                cb(curPath);
                await afs.unlink(curPath);                              
            }
        }
        await afs.rmdir(path);
    }
};

export const extractZip = (sourceFilePath: string, targetPath: string, cb: (entry: StreamZip.ZipEntry, filename: string, totalSize: number) => void) => {
    return new Promise( (resolve, reject) => {
        const zip = new StreamZip({
            file: sourceFilePath,
            storeEntries: true,
            skipEntryNameValidation: true
        });        
        zip.on('ready', () => {               
            let totalSize = 0;
            for (const entry of Object.values(zip.entries())) {
                totalSize+=entry.size;
            }
            zip.extract(null, targetPath, (err) => {
                if (err) {
                    reject(err);                    
                } else {
                    resolve('Success');
                }
                zip.close();
            });        
            zip.on('extract', (entry, file) => {
                cb(entry, file, totalSize);
            });
        });
    });
};





