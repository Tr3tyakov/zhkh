import React, { useState } from 'react';
import { Avatar, Box, ListItemButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from 'js-cookie';
export const UserMenu = ({ user }: { user: any }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate(`/users/edit-user/${user!.id}`);
        handleCloseMenu();
    };

    const handleLogout = () => {
        handleCloseMenu();
        Cookies.remove("refresh_token");
        Cookies.remove("access_token");
        navigate(`/auth`);
    };

    return (
        <Box>
            <ListItemButton disableRipple onClick={handleOpenMenu}>
                <Box display="flex" alignItems="center" gap="10px">
                    <Avatar src={user?.filePath} />
                    <Box display="flex" justifyContent="center" flexDirection="column">
                        <Typography
                            fontSize="14px"
                            color="primary.contrastText"
                            fontWeight={600}
                        >
                            {user?.firstName} {user?.middleName}
                        </Typography>
                    </Box>
                </Box>
            </ListItemButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Профиль
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Выход
                </MenuItem>
        </Menu>
</Box>
)
    ;
};
