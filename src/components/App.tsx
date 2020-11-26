import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./../app.css";
import { Manager } from './Manager';
import AppConfig from '../config/AppConfig';

const App = () => {
    AppConfig.loadAppDefaults();
    return (
        <div className="center-container">
            <Manager />
            <div className="footer">Copyright © 2020 Pure Commerce. All rights reserved.</div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));