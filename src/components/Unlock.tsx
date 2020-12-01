import React from 'react';
import { InputGroup, Tooltip, Button, Intent, Toaster, IToastProps, Position } from '@blueprintjs/core';
import { Spacer } from './Spacer';
import AppConstants from '../constants/AppConstants';
import { Spinner } from "@blueprintjs/core";

export const Unlock = (props: { onSuccess(isPasswordCorrect: boolean): void }) => {

    const [showPassword, setShowPassword] = React.useState(false);
    const [password, setPassword] = React.useState("");

    const handleLockClick = () => setShowPassword(!showPassword);
    const lockButton = (
        <Tooltip content={`${showPassword ? "Hide" : "Show"} password`} >
            <Button
                icon={showPassword ? "unlock" : "lock"}
                intent={Intent.WARNING}
                minimal={true}
                onClick={handleLockClick}
            />
        </Tooltip>
    );

    const unlock = () => {
        setInProgress(true);
        const isCorrect: boolean = (password === AppConstants.PASSWORD);
        //Timeout for aesthetics only
        let timeout = 300;
        if (isCorrect) {
            timeout = 1000;
        }
        setTimeout(() => {
            setInProgress(false);
            setPassword("");
            props.onSuccess(isCorrect)
        }, timeout);
    };

    const handleOnChange = (e: any) => {
        setPassword(e.target.value);
    };

    const [inProgress, setInProgress] = React.useState(false);

    return (
        <>
            {inProgress ?
                <Spinner intent={Intent.PRIMARY} />
                :
                <div className="unlock">
                    <InputGroup
                        placeholder="Enter password..."
                        rightElement={lockButton}
                        type={showPassword ? "text" : "password"}
                        onChange={handleOnChange}
                        value={password}
                    />
                    <Spacer />
                    <Button intent={Intent.PRIMARY} onClick={unlock} text="Unlock" />
                </div>
            }
        </>
    );

}