import React from 'react';
import { Intent, ProgressBar } from '@blueprintjs/core';
import { InstallFxChoice, InstallUninstallParamsType } from './InstallFxChoice';
import { UninstallFxChoice } from './UninstallFxChoice';
import { Spacer } from './Spacer';
import AppConstants from '../constants/AppConstants';
import AppToaster from './AppToaster';
import logger from 'electron-log';
import { remote } from 'electron';

export const Manager = () => {

    const source = AppConstants.SOURCE;
    const target = AppConstants.TARGET;

    const [progress, setProgress] = React.useState({ inProgress: false, value: 0, description: null });
    
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

            //Disable close button while in progress
            remote.getCurrentWindow().setClosable(false);
            
            //This prevents progress bar to run continuously in event of an unexpected error
            tId = setTimeout(() => {
                logger.error('Operation timed out. Check logs for details.');
                handleError('Operation timed out. Check logs for details.');
                setProgress({
                    inProgress: false,
                    value: 0,
                    description: ""
                });
            }, AppConstants.PROGRESS_TIMEOUT_IN_SECS * 1000);
            
        }
        return () => {
            remote.getCurrentWindow().setClosable(true);
            clearTimeout(tId);
        }
    }, [progress.inProgress]);

    const handleError = (msg: string) => {
        AppToaster.failure(msg);
    };

    const handleSuccess = (msg: string) => {
        AppToaster.success(msg);
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

        </>
    );
}
