import * as React from 'react';

/* Using functional components with hooks */

export default function Clock() {
    
    const[date, setDate] = React.useState(new Date());
    
    React.useEffect(() => {
        
        function tick() {
            setDate(new Date());
        }

        let timerID = setInterval(
            () => tick(),
            1000
        );
        return () => clearInterval(timerID);
    });

    return (
        <div>
            <h2>It is {date.toLocaleTimeString()}.</h2>
        </div>
    );
}