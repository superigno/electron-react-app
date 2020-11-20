import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./../app.css";
import { Manager } from './Manager';

const appVersion = "1.0.0";

const App = () => {
    React.useEffect(() => {
        document.title = `Global FxChoice Installation Manager v${appVersion}`;
    });

    return (
        <div className="center-container">
            <Manager />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));