import Path from 'path';
import fs from 'fs';

//TODO: improve
export const getTotalFileCount = (pathArray: string[]) => {
    let fileCount = 0;
    const countFiles = function (path: string) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file: string, index: number) => {
                const curPath = Path.join(path, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    countFiles(curPath);
                } else {
                    fileCount++;
                }
            });
        }
    };
    pathArray.forEach(path => {
        countFiles(path);
    });    
    return fileCount;
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



