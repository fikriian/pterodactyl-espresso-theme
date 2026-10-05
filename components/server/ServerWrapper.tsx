import React, { useState } from 'react';
import ServerSidebar from './ServerSidebar';
import ConflictStateRenderer from './ConflictStateRenderer';

export default () => {
    return (
        <div id="espresso-server-base">
            <ServerSidebar />
            <ConflictStateRenderer />
        </div>
    );
};
