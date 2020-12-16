import React from 'react';

export const Spacer = (props: {hidden?: boolean}) => {
    return <>
        {!props.hidden &&
            <div className="spacer" />
        }
    </>
};