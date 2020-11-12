import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Clock} from './Clock';

class App extends React.Component {
    render() {
        return <Clock/>;
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);