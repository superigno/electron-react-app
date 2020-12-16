import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./../app.css";
import logo from '../../assets/images/pc.png';
import { Manager } from './Manager';
import { Unlock } from './Unlock';
import { Lock } from './Lock';
import AppConfig from '../config/AppConfig';
import AppToaster from "./AppToaster";
import AppConstants from "../constants/AppConstants";
import { remote } from 'electron';

const App = () => {

    AppConfig.loadAppDefaults();

    const isRequirePassword = AppConstants.REQUIRE_PASSWORD;
    
    const [isLocked, setIsLocked] = React.useState(isRequirePassword);
    const [hideLock, setHideLock] = React.useState(false);

    const handleOnUnlock = (isUnlocked: boolean) => {
        if (isUnlocked) {
            AppToaster.success("Unlocked", 1000);
        } else {
            AppToaster.failure("Wrong password");
        }
        setIsLocked(!isUnlocked);
    }

    const handleOnLock = () => {
        setIsLocked(true);
        AppToaster.success("Locked", 1000);
    }

    const handleOnProgress = (isInProgress: boolean) => {
        setHideLock(isInProgress);
        //Disable close button while in progress
        remote.getCurrentWindow().setClosable(!isInProgress);
    }

    return (
        <>
            <div className="center-container">
                <img className="logo" src={logo} />
                {isLocked ? <Unlock onSuccess={handleOnUnlock} /> : <Manager onProgress={handleOnProgress} /> }
                <div className="footer">Copyright © 2020 Pure Commerce. All rights reserved.</div>
                {isRequirePassword && !isLocked && !hideLock && <Lock onClick={handleOnLock} />}
            </div>
        </>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));