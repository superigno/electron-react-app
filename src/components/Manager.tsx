import React from 'react';
import { Intent, ProgressBar, Alert } from '@blueprintjs/core';
import logo from '../../assets/images/pc_logo.png';
import { InstallFxChoice, InstallUninstallParamsType } from './InstallFxChoice';
import { UninstallFxChoice } from './UninstallFxChoice';
import { Spacer } from './Spacer';

const source = 'C:\\Users\\gino.q\\Desktop\\temp1\\GlobalFxChoice-Installer-PROD-LS-HK_v1-3-08.zip';
const target = 'C:\\Users\\gino.q\\Desktop\\temp2';

const AlertMessage = (props: {isSuccess: boolean, message: string}) => {
    if (props.isSuccess) {
        return (
            <>
                <h3>Success</h3>
                <p>{unescape(props.message)}</p>
            </>
        )
    } else {
        return (
            <>
                <h3>Error</h3>
                <p>{unescape(props.message)}</p>
                <p>Make sure to uninstall Global FxChoice first before installing. If error persists, contact your Adminstrator.</p>                
            </>
        )
    }
};

export const Manager = () => {

    const [progress, setProgress] = React.useState({ inProgress: false, value: 0, description: null });
    const [alert, setAlert] = React.useState({ isError: false, openAlert: false, message: null });
    
    const showProgress = (params: InstallUninstallParamsType) => {
        setProgress({
            inProgress: params.inProgress,
            value: params.progress,
            description: params.description
        });
    };

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
        setProgress({
            inProgress: false,
            value: 0,
            description: null
        });
    };   

    return (
        <>
            <img className="logo" src={logo} />

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
                <AlertMessage isSuccess={!alert.isError} message={alert.message} />                
            </Alert>

        </>
    );
}
