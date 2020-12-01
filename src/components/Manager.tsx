import React from 'react';
import { Intent, ProgressBar } from '@blueprintjs/core';
import { InstallFxChoice, InstallUninstallParamsType } from './InstallFxChoice';
import { UninstallFxChoice } from './UninstallFxChoice';
import { Spacer } from './Spacer';
import AppConstants from '../constants/AppConstants';
import AppToaster from "./AppToaster";

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
