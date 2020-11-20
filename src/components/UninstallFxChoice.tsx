import React from 'react';
import { Button, Intent, Alert } from '@blueprintjs/core';
import {getTotalFileCount, deleteFolderRecursive} from '../util/FileUtils';
import {InstallUninstallParamsType} from './InstallFxChoice';
import Path from 'path';

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

    const uninstallPackage = () => {
        setAlertOpen(false);

        const totalFileCount = getTotalFileCount([fxchoicePath, fxchoiceServiceManagerPath]);
        console.log('Total:', totalFileCount);
        
        let totalDeleted = 0;
        var promises = [];
        promises.push(deleteFolderRecursive(fxchoicePath, (filename: string) => {
            totalDeleted++;
            isUninstalling({inProgress: true, progress: totalDeleted / totalFileCount, description: `Uninstalling ${filename}`});
        }));

        promises.push(deleteFolderRecursive(fxchoiceServiceManagerPath, (filename: string) => {
            totalDeleted++;
            isUninstalling({inProgress: true, progress: totalDeleted / totalFileCount, description: `Uninstalling ${filename}`});
        }));

        Promise.all(promises)
        .then(()=> {
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
                    intent={Intent.DANGER}
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