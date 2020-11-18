import Path from 'path';
import fs from 'fs';

export const getTotalFileCount = (p: string) => {
    let fileCount = 0;
    const countFiles = function (path: string) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file: string, index: number) => {
                const curPath = Path.join(path, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    countFiles(curPath);
                } else {
                    fileCount++;
                }
            });
        }
    };
    countFiles(p);
    return fileCount;
};

const afs = fs.promises;
export const deleteFolderRecursive = async (path: fs.PathLike, cb: (filename: string) => void ) => {
    if (fs.existsSync(path)) {
        for (let entry of await afs.readdir(path)) {
            const curPath = path + "/" + entry;
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


