import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./../app.css";
import {Manager} from './Manager';

const App = () => (
    <div className="center-container">
        <Manager />
    </div>
);

ReactDOM.render(<App />, document.getElementById('root'));