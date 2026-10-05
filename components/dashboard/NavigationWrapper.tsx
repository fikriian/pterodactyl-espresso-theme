import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardTopBar from './DashboardTopBar';
import DashboardSidebar from './DashboardSidebar';

export default () => {
    const { pathname } = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // DO NOT render dashboard navigation on Server pages
    if (pathname.startsWith('/server')) {
        return null;
    }

    const isAccount = pathname.startsWith('/account');

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        window.dispatchEvent(new CustomEvent('espresso-search', { detail: value }));
    };

    return (
        <div id="espresso-navigation">
            <DashboardSidebar 
                mobileOpen={mobileOpen} 
                onCloseMobile={() => setMobileOpen(false)} 
            />
            {!isAccount && (
                <DashboardTopBar 
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    onOpenMobile={() => setMobileOpen(true)}
                />
            )}
        </div>
    );
};
