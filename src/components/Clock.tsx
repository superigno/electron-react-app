import * as React from 'react';
import logo from '../../assets/images/pc_logo.png';

type Props = {   
}

type State = {
    date: Date
}

export class Clock extends React.Component<Props, State> {

    timerID: NodeJS.Timeout;

    constructor(props: any) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div>
                <img src={logo} />
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}