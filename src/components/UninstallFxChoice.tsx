import React from 'react';
import { Button, Intent, Alert } from '@blueprintjs/core';
import { getTotalFileCount, deleteFolderRecursive } from '../util/FileUtils';
import { InstallUninstallParamsType } from './InstallFxChoice';
import Path from 'path';
import { RunService } from '../util/ServiceUtils';
import fs from 'fs';
import logger from 'electron-log';
import AppConstants from '../constants/AppConstants';

type propsType = {
    path: string,
    onUninstall: (params: InstallUninstallParamsType) => void,
    onError: (msg: string) => void,
    onSuccess: (msg: string) => void
};

export const UninstallFxChoice = (props: propsType) => {

    const path = props.path;
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

    React.useEffect(() => {
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

    const isDirectoriesExist = () => {
        if (fs.existsSync(Path.join(path, AppConstants.FXCHOICE_PATH)) || fs.existsSync(Path.join(path, AppConstants.FXCHOICE_MANAGER_PATH))) {
            return true;
        }
        return false;
    };

    const uninstallPackage = () => {

        logger.info('***** Start Uninstallation *****');

        setAlertOpen(false);

        if (!isDirectoriesExist()) {
            hasError('Already uninstalled.');
            logger.error('Already uninstalled.');
            return;
        }

        let totalFileCount = 0;
        let totalDeleted = 0;
        const fxchoicePath = Path.join(path, AppConstants.FXCHOICE_PATH);
        const fxchoiceServiceManagerPath = Path.join(path, AppConstants.FXCHOICE_MANAGER_PATH);
        const fxchoiceBatPath = Path.join(fxchoicePath, AppConstants.UNINSTALL_SERVICE_PATH);
        const fxchoiceServiceManagerBatPath = Path.join(fxchoiceServiceManagerPath, AppConstants.UNINSTALL_MANAGER_SERVICE_PATH);

        let progressValue: number = 0;
        //hack for aesthetic purposes
        const estimatedServiceProgressValue: number = 0.01;
        const numberOfServices = 2;

        isUninstalling({ inProgress: true, progress: 0, description: 'Preparing to uninstall Global FxChoice...' });

        getTotalFileCount(fxchoicePath)
            .then(count => {
                totalFileCount = count;
                return getTotalFileCount(fxchoiceServiceManagerPath);
            }).then(count => {
                totalFileCount += count;
            }).then(() => {
                progressValue += estimatedServiceProgressValue;
                return RunService(fxchoiceServiceManagerBatPath, (msg) => {
                    logger.info(msg);
                    isUninstalling({ inProgress: true, progress: progressValue, description: 'Uninstalling Global FxChoice Service Manager service...' });
                });
            }).then(() => {
                progressValue += estimatedServiceProgressValue;
                return RunService(fxchoiceBatPath, (msg) => {
                    logger.info(msg);
                    isUninstalling({ inProgress: true, progress: progressValue, description: 'Uninstalling Global FxChoice service...' });
                });
            }).then(() => {
                //Put a delay to make sure processes are released first before deleting the folders...
                return new Promise((resolve) => 
                    setTimeout(resolve, 5000)
                );
            }).then(() => {
                return deleteFolderRecursive(fxchoiceServiceManagerPath, (filename: string) => {
                    totalDeleted++;
                    progressValue = (totalDeleted / totalFileCount) + (estimatedServiceProgressValue*numberOfServices);
                    isUninstalling({ inProgress: true, progress: progressValue, description: `Uninstalling ${filename}` });
                });
            }).then(() => {
                return deleteFolderRecursive(fxchoicePath, (filename: string) => {
                    totalDeleted++;
                    progressValue = (totalDeleted / totalFileCount) + (estimatedServiceProgressValue*numberOfServices);
                    isUninstalling({ inProgress: true, progress: progressValue, description: `Uninstalling ${filename}` });
                });
            }).then(() => {
                isUninstalling({ inProgress: false, progress: 0, description: null });
                isSuccess('Global FxChoice successfully uninstalled.');
                logger.info('Uninstallation complete.');
            }).catch(error => {
                logger.error('Error:', error);
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