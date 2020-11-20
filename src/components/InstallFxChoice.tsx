import React from 'react';
import { Button, Intent, Alert } from '@blueprintjs/core';
import extract from 'extract-zip';
import Path from 'path';
import fs from 'fs';

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

    React.useEffect(()=> {
        return () => {
            isMounted.current = false;
        }
    },[]);

    const hasError = (msg: string) => {
        props.onError(msg);
    };

    const isSuccess = (msg: string) => {
        props.onSuccess(msg);
    };

    const isDirectoriesExist = (target: string) => {
        if (fs.existsSync(Path.join(target, 'fxchoice')) || fs.existsSync(Path.join(target, 'fxchoicemanager'))) {
            return true;
        }
        return false;
    };

    const installPackage = () => {
        setAlertOpen(false);

        if (isDirectoriesExist(target)) {
            hasError('Directories already exist.');
            return;
        }

        extract(source, {
            dir: target, onEntry: (entry, zipFile) => {
                isInstalling({ inProgress: true, progress: zipFile.entriesRead / zipFile.entryCount, description: `Installing ${Path.join(target, entry.fileName)}` });
            }
        }).then(() => {
            isInstalling({ inProgress: false, progress: 0, description: 'Installation complete.' });
            isSuccess('Global FxChoice successfully installed.');
        }).catch(error => {
            isInstalling({ inProgress: false, progress: 0, description: error });
            hasError(error);
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
                    <p>This will install Global FxChoice to C:\ drive</p>

                </Alert>
            </div>
        </>
    )
}