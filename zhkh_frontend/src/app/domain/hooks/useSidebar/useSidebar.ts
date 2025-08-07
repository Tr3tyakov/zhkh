import React from 'react';

const useSidebar = () => {
    const [isSidebarOpen, setIsSideBarOpen] = React.useState<boolean>(false);
    const handleClose = () => setIsSideBarOpen((state) => !state);

    return { handleClose, isSidebarOpen };
};

export default useSidebar;
