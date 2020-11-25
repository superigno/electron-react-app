import React from 'react';
import { Button, Intent, Alert } from '@blueprintjs/core';
import {getTotalFileCount, deleteFolderRecursive} from '../util/FileUtils';
import {InstallUninstallParamsType} from './InstallFxChoice';
import Path from 'path';
import {RunServiceBat} from '../util/ServiceUtils';
import fs from 'fs';

type propsType = {
    path: string,
    onUninstall: (params: InstallUninstallParamsType) => void,
    onError: (msg: string) => void,
    onSuccess: (msg: string) => void
};

export const UninstallFxChoice = (props: propsType) => {

    const path = props.path;
    const fxchoicePath = Path.join(path, 'fxchoice');
    const fxchoiceServiceManagerPath = Path.join(path, 'fxchoiceservicemanager');
    const isMounted = React.useRef(true);
    
    const [disableButton, setDisableButton] = React.useState(false);
    const [isAlertOpen, setAlertOpen] = React.useState(false);

    const handleAlertOpen = () => (
        setAlertOpen(true)
    );
    const handleAlertCancel = () => (
        setAlertOpen(false)
    );

    const isUninstalling = (params: InstallUninstallParamsType) => {
        props.onUninstall(params);
        if (isMounted.current) {
           setDisableButton(params.inProgress);
        }
    };   

    React.useEffect(()=> {
        return () => {
            isMounted.current = false;
        }
    }, []);

    const hasError = (msg: string) => {
        props.onError(msg);
    };

    const isSuccess = (msg: string) => {
        props.onSuccess(msg);
    };
    
    const isDirectoriesExist = (path: string) => {
        if (fs.existsSync(Path.join(path, 'fxchoice')) || fs.existsSync(Path.join(path, 'fxchoicemanager'))) {
            return true;
        }
        return false;
    };

    const uninstallPackage = () => {
        setAlertOpen(false);

        if (!isDirectoriesExist(path)) {
            hasError('Already uninstalled.');
            return;
        }

        const totalFileCount = getTotalFileCount([fxchoicePath, fxchoiceServiceManagerPath]);
        console.log('Total:', totalFileCount);
        
        let totalDeleted = 0;        

        const fxchoiceBatPath = `${Path.join(fxchoicePath, 'bat', 'uninstallService.bat')}`;
        const fxchoiceServiceManagerBatPath = `${Path.join(fxchoiceServiceManagerPath, 'bat', 'uninstallService.bat')}`;

        RunServiceBat(fxchoiceBatPath, (msg) => {
            console.log(msg);
            isUninstalling({ inProgress: true, progress: 1, description: 'Uninstalling Global FxChoice service...' });            
        }).then(() => {            
            return RunServiceBat(fxchoiceServiceManagerBatPath, (msg) => {
                console.log(msg);
                isUninstalling({ inProgress: true, progress: 1, description: 'Uninstalling Global FxChoice Service Manager service...' });    
            });            
        }).then(() => {
            return deleteFolderRecursive(fxchoicePath, (filename: string) => {
                totalDeleted++;
                isUninstalling({inProgress: true, progress: totalDeleted / totalFileCount, description: `Uninstalling ${filename}`});
            });
        }).then(()=>{
            return deleteFolderRecursive(fxchoiceServiceManagerPath, (filename: string) => {
                totalDeleted++;
                isUninstalling({inProgress: true, progress: totalDeleted / totalFileCount, description: `Uninstalling ${filename}`});
            })
        }).then(()=> {
            console.log('Uninstallation complete.');
            console.log('Total deleted:', totalDeleted);
            isUninstalling({inProgress: false, progress: 0, description: null});
            isSuccess('Global FxChoice successfully uninstalled.');
        }).catch(error => {
            isUninstalling({ inProgress: false, progress: 0, description: error });
            hasError(error);
        });
       
    };

    return (
        <>
            <div>
                <Button intent={Intent.NONE} onClick={handleAlertOpen} text="Uninstall Global FxChoice" disabled={disableButton} />
                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Uninstall"
                    icon="delete"
                    intent={Intent.NONE}
                    isOpen={isAlertOpen}
                    onCancel={handleAlertCancel}
                    onConfirm={uninstallPackage}
                >
                    <p>
                        This will uninstall Global FxChoice. Any existing data will be completely removed. Do you want to continue?
                    </p>

                </Alert>
            </div>
        </>
    )
}