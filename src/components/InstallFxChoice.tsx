import React from 'react';
import { Button, Intent, Alert } from '@blueprintjs/core';
import Path from 'path';
import fs from 'fs';
import { RunService } from '../util/ServiceUtils';
import logger from 'electron-log';
import AppConstants from '../constants/AppConstants';
import { extractZip } from '../util/FileUtils';

type propsType = {
    source: string,
    target: string,
    onInstall: (params: InstallUninstallParamsType) => void,
    onError: (msg: string) => void,
    onSuccess: (msg: string) => void
};

export type InstallUninstallParamsType = {
    inProgress: boolean,
    progress: number,
    description: string
};

export const InstallFxChoice = (props: propsType) => {

    const source = props.source;
    const target = props.target;
    const isMounted = React.useRef(true);

    const [disableButton, setDisableButton] = React.useState(false);
    const [isAlertOpen, setAlertOpen] = React.useState(false);

    const handleAlertOpen = () => (
        setAlertOpen(true)
    );
    const handleAlertCancel = () => (
        setAlertOpen(false)
    );

    const isInstalling = (params: InstallUninstallParamsType) => {
        props.onInstall(params);
        if (isMounted.current) { //Manager hides button upon progress, so need to check if present to prevent error
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

    const isTargetDirectoriesExist = () => {
        if (fs.existsSync(Path.join(target, AppConstants.FXCHOICE_PATH)) || fs.existsSync(Path.join(target, AppConstants.FXCHOICE_MANAGER_PATH))) {
            return true;
        }
        return false;
    };

    const getSourceFile = (): string[] => {
        let zipFiles = fs.readdirSync(source).filter(function (file) {
            return Path.extname(file).toLowerCase() === '.zip';
        });
        logger.info('Source file found:', zipFiles);
        return zipFiles;
    }

    const installPackage = () => {

        logger.info('***** Start Installation *****');

        setAlertOpen(false);

        if (isTargetDirectoriesExist()) {
            hasError('Global FxChoice already installed. To reinstall, click \'Uninstall Global FxChoice\' first, then try again.');
            logger.error('Global FxChoice already installed.');
            return;
        }

        let soureFileArr = getSourceFile();
        if (soureFileArr.length > 1) {
            hasError('Too many .zip files in the package folder (resources/package).');
            return;
        } else if (soureFileArr.length === 0) {
            hasError('Please upload a valid file in the package folder (ie: resources/package/GlobalFxChoice.zip)');
            return;
        }

        const sourceFilePath = Path.join(source, soureFileArr[0]);
        const fxchoiceInstallBatPath = Path.join(target, AppConstants.FXCHOICE_PATH, AppConstants.INSTALL_SERVICE_PATH);
        const fxchoiceServiceManagerInstallBatPath = Path.join(target, AppConstants.FXCHOICE_MANAGER_PATH, AppConstants.INSTALL_MANAGER_SERVICE_PATH);
        const fxchoiceStartBatPath = Path.join(target, AppConstants.FXCHOICE_PATH, AppConstants.START_SERVICE_PATH);
        const fxchoiceServiceManagerStartBatPath = Path.join(target, AppConstants.FXCHOICE_MANAGER_PATH, AppConstants.START_MANAGER_SERVICE_PATH);

        let totalSizeExtracted = 0;
        let progressValue: number = 0;
        
        //hack for aesthetic purposes
        const estimatedServiceProgressValue: number = 0.02;
        const numberOfServicesPlusOne = 4+1;

        isInstalling({ inProgress: true, progress: 0, description: 'Preparing to install Global FxChoice...' });

        extractZip(sourceFilePath, target, (entry, filename, totalSize) => {
            totalSizeExtracted += entry.size;
            progressValue = (totalSizeExtracted / totalSize) - (estimatedServiceProgressValue * numberOfServicesPlusOne);
            isInstalling({ inProgress: true, progress: progressValue, description: `Installing ${filename}` });
        }).then(() => {
            progressValue += estimatedServiceProgressValue;
            return RunService(fxchoiceInstallBatPath, () => {
                isInstalling({ inProgress: true, progress: progressValue, description: 'Installing Global FxChoice service...' });
            });
        }).then(() => {
            progressValue += estimatedServiceProgressValue;
            return RunService(fxchoiceServiceManagerInstallBatPath, () => {
                isInstalling({ inProgress: true, progress: progressValue, description: 'Installing Global FxChoice Service Manager service...' });
            });
        }).then(() => {
            progressValue += estimatedServiceProgressValue;
            return RunService(fxchoiceStartBatPath, () => {
                isInstalling({ inProgress: true, progress: progressValue, description: 'Starting Global FxChoice service...' });
            });
        }).then(() => {
            progressValue += estimatedServiceProgressValue;
            return RunService(fxchoiceServiceManagerStartBatPath, () => {
                isInstalling({ inProgress: true, progress: progressValue, description: 'Starting Global FxChoice Service Manager service...' });
            });
        }).then(() => {
            //Put a delay to make sure processes are released first
            return new Promise((resolve) => 
                setTimeout(resolve, 5000)
            );
        }).then(() => {
            isSuccess('Global FxChoice successfully installed.');
            logger.info('Installation complete.');
        }).catch((error: any) => {
            logger.error('Error:', error);
            hasError(`${error}. See logs/fxchoice.log for details.`);
        }).finally(() => {
            isInstalling({ inProgress: false, progress: 0, description: '' });
        });

    };
    return (
        <>
            <div>
                <Button intent={Intent.PRIMARY} onClick={handleAlertOpen} text="Install Global FxChoice" disabled={disableButton} />
                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Install"
                    icon="bring-data"
                    intent={Intent.PRIMARY}
                    isOpen={isAlertOpen}
                    onCancel={handleAlertCancel}
                    onConfirm={installPackage}
                >
                    <p>This will install Global FxChoice to {target}</p>

                </Alert>
            </div>
        </>
    )
}