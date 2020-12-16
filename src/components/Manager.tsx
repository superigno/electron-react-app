import React from 'react';
import { Intent, ProgressBar, Alert } from '@blueprintjs/core';
import { InstallFxChoice, InstallUninstallParamsType } from './InstallFxChoice';
import { UninstallFxChoice } from './UninstallFxChoice';
import { Spacer } from './Spacer';
import AppConstants from '../constants/AppConstants';
import logger from 'electron-log';
import Path from 'path';

export const Manager = (props: { onProgress: (isInProgress: boolean) => void }) => {

    const source = AppConstants.SOURCE;
    const target = AppConstants.TARGET;

    const [progress, setProgress] = React.useState({ inProgress: false, value: 0, description: null });
    const [alert, setAlert] = React.useState({ isError: false, openAlert: false, message: null });

    const showProgress = (params: InstallUninstallParamsType) => {
        setProgress({
            inProgress: params.inProgress,
            value: params.progress,
            description: params.description
        });
    };

    React.useEffect(() => {
        let tId: NodeJS.Timeout;
        if (progress.inProgress) {

            props.onProgress(true);

            //This prevents progress bar to run continuously in event of an unexpected error
            tId = setTimeout(() => {
                logger.error('Operation timed out.');
                handleError(`Operation timed out. See ${Path.resolve('logs/fxchoice.log')} for details.`);
                setProgress({
                    inProgress: false,
                    value: 0,
                    description: ""
                });
            }, AppConstants.PROGRESS_TIMEOUT_IN_SECS * 1000);

        }
        return () => {
            props.onProgress(false);
            clearTimeout(tId);
        }
    }, [progress.inProgress]);

    const handleError = (msg: string) => {
        setAlert({
            isError: true,
            openAlert: true,
            message: escape(msg)
        });
    };

    const handleSuccess = (msg: string) => {
        setAlert({
            isError: false,
            openAlert: true,
            message: escape(msg)
        });
    };

    const handleAlertClose = () => {
        setAlert({
            isError: false,
            openAlert: false,
            message: null
        });
    };  

    return (
        <>
            {progress.inProgress ?

                <div className="progress-bar">
                    <Spacer />
                    <ProgressBar intent={Intent.WARNING} value={progress.value} />
                    <Spacer />
                    <div className="progress-bar-desc">
                        {progress.description}
                    </div>
                </div>
                :
                <div>
                    <InstallFxChoice source={source} target={target} onInstall={showProgress} onError={handleError} onSuccess={handleSuccess} />
                    <Spacer />
                    <UninstallFxChoice path={target} onUninstall={showProgress} onError={handleError} onSuccess={handleSuccess} />
                </div>
            }

            <Alert
                confirmButtonText="Okay"
                isOpen={alert.openAlert}
                icon={alert.isError ? "error" : "tick"}
                intent={alert.isError ? Intent.DANGER : Intent.SUCCESS}
                onClose={handleAlertClose}
            >
                <p>{unescape(alert.message)}</p>                
            </Alert>

        </>
    );
}
