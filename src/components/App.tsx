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
import { remote } from 'electron';

const App = () => {

    AppConfig.loadAppDefaults();
    
    const [isPasswordCorrect, setIsPasswordCorrect] = React.useState(false);
    const [hideLock, setHideLock] = React.useState(false);

    const handleOnUnlock = (b: boolean) => {
        if (b) {
            AppToaster.success("Unlocked", 1000);
        } else {
            AppToaster.failure("Wrong password");
        }
        setIsPasswordCorrect(b);
    }

    const handleOnLock = () => {
        setIsPasswordCorrect(false);
        AppToaster.success("Locked", 1000);
    }

    const handleOnProgress = (b: boolean) => {
        setHideLock(b);
        //Disable close button while in progress
        remote.getCurrentWindow().setClosable(!b);
    }

    return (
        <>
            <div className="center-container">
                <img className="logo" src={logo} />
                {isPasswordCorrect ? <Manager onProgress={handleOnProgress} /> : <Unlock onSuccess={handleOnUnlock} />}
                <div className="footer">Copyright © 2020 Pure Commerce. All rights reserved.</div>
                {isPasswordCorrect && !hideLock && <Lock onClick={handleOnLock} />}
            </div>
        </>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));