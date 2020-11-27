import Path from 'path';
import fs from 'fs';
import countFiles from 'count-files';

export const getTotalFileCount = (path: string): Promise<number> => {
    return new Promise((resolve) => {
        countFiles(path, function (err: any, results: any) {
            resolve(results.files);
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



