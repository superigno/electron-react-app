import React from 'react';
import extract from 'extract-zip';
import { Button, Intent, ProgressBar, Alert } from '@blueprintjs/core';
import logo from '../../assets/images/pc_logo.png';
import {getTotalFileCount, deleteFolderRecursive} from '../util/FileUtils';

const source = 'C:/Users/gino.q/Desktop/temp1/GlobalFxChoice-Installer-PROD-LS-HK_v1-3-08.zip';
const target = 'C:/Users/gino.q/Desktop/temp2';
const fxchoicePath = `${target}/fxchoice`;
const fxchoiceManagerPath = `${target}/fxchoicemanager`;

const Spacer = () => (
    <div className="spacer" />
);

export const Manager = () => {

    const [progress, setProgress] = React.useState({inProgress: false, value: 0, description: null});
    const [isAlertOpen, setAlertOpen] = React.useState(false);
    const handleMoveOpen = () => (
        setAlertOpen(true)
    );
    const handleMoveCancel = () => (
        setAlertOpen(false)
    );

    const [isUninstallAlertOpen, setUninstallAlertOpen] = React.useState(false);
    const handleUninstallOpen = () => (
        setUninstallAlertOpen(true)
    );
    const handleUninstallCancel = () => (
        setUninstallAlertOpen(false)
    );

    //TODO:
    React.useEffect(() => {        
        console.log('Here useEffect');
        return function cleanup() {
            console.log('Here cleanup');
        };
      });


    const installPackage = () => {
        console.log('Copying files...');
        setAlertOpen(false);
        extract(source, {
            dir: target, onEntry: (entry, zipFile) => {
                setProgress({inProgress: true, value: zipFile.entriesRead / zipFile.entryCount, description: `Installing ${target}/${entry.fileName}`});                
            }
        }).then(() => {
            setProgress({inProgress: false, value: 0, description: null});
            console.log('Installation complete.');
        }).catch(error => {
            console.log('Installation error: ', error);
        });

    };

    const uninstallPackage = () => {
        console.log("Removing files...");
        setUninstallAlertOpen(false);
        setProgress({inProgress: true, value: 0, description: null});
        let totalFileCount = getTotalFileCount(fxchoicePath);
        let totalDeleted = 0;
        deleteFolderRecursive(fxchoicePath, (filename: string) => {
            totalDeleted++;
            setProgress({inProgress: true, value: totalDeleted / totalFileCount, description: `Uninstalling ${filename}`});
        })
        .then(()=> {
            console.log('Uninstallation complete.');
            console.log('Total deleted:', totalDeleted);
            setProgress({inProgress: false, value: 0, description: null});
        }).catch(error => {
            console.log('Uninstallation error: ', error);
        });
    };

    return (
        <>
            <img className="logo" src={logo} />

            {!progress.inProgress ?
                <div>
                    <div>
                        <Button intent={Intent.PRIMARY} onClick={handleMoveOpen} text="Install Global FxChoice" />
                        <Alert
                            cancelButtonText="Cancel"
                            confirmButtonText="Install"
                            icon="bring-data"
                            intent={Intent.PRIMARY}
                            isOpen={isAlertOpen}
                            onCancel={handleMoveCancel}
                            onConfirm={installPackage}
                        >
                            <p>
                                This will install Global FxChoice to C:/
                            </p>

                        </Alert>
                    </div>
                    <Spacer />
                    <div>
                        <Button intent={Intent.NONE} onClick={handleUninstallOpen} text="Uninstall Global FxChoice" />
                        <Alert
                            cancelButtonText="Cancel"
                            confirmButtonText="Uninstall"
                            icon="delete"
                            intent={Intent.DANGER}
                            isOpen={isUninstallAlertOpen}
                            onCancel={handleUninstallCancel}
                            onConfirm={uninstallPackage}
                        >
                            <p>
                                This will uninstall Global FxChoice. Any existing data will be removed. Do you want to continue?
                            </p>

                        </Alert>
                    </div>
                </div>
                :
                <div className="progress-bar">
                    <Spacer />
                    <ProgressBar intent={Intent.WARNING} value={progress.value} />
                    <Spacer />
                    {progress.description}
                </div>
            }

        </>
    );
}
