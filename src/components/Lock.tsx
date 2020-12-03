import React from 'react';
import { Icon, Tooltip, Position } from '@blueprintjs/core';

export const Lock = (props: { onClick: () => void }) => {

    const handleLockClick = () => {
        props.onClick();
    }

    return (
        <div className="lock">
            <Tooltip content='Lock' position={Position.LEFT} minimal >
                <Icon icon="lock" iconSize={12} onClick={handleLockClick} />
            </Tooltip>
        </div>
    );
}