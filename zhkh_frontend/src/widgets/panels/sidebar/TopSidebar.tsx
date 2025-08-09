import {
    Box,
    Container,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { StyleListItemButton } from '../../../shared/styled/ListItemButton.tsx';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';
import { UserTypeEnum } from '../../../app/infrastructures/enums/user.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminNavigation, DefaultUserNavigation } from './topSidebar.constants.tsx';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './topSidebar.scss';
import { UserMenu } from './userMenu/UserMenu.tsx';
import Icon from '../../../app/assets/icons/icon.png';
import { motion } from 'framer-motion';
import { defaultMotionConfig } from '../../../app/domain/motion/motionBox.ts';


const MotionStyleListItemButton = motion.create(StyleListItemButton);

const TopSidebar: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const navigationItems =
        user?.userType === UserTypeEnum.ADMIN ? AdminNavigation : DefaultUserNavigation;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        handleClose();
    };

    return (
        <Box display="flex" flexDirection="column" width="100%">
            {/* Верхняя панель с пользователем */}
            <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="primary.main"
            >
                <Container maxWidth="lg">
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box p="10px" display="flex" justifyContent="center">
                            <Box width="35px" component="img" src={Icon} />
                        </Box>
                        <UserMenu user={user} />
                    </Box>
                </Container>
            </Box>


            {/* Меню */}
            <Box
                display="flex"
                alignItems="center"
                width="100%"
                height="54px"
                padding="0 20px"
                bgcolor="#e9f1f8"
            >
                <Container maxWidth="lg">
                    <Box display="flex" flexGrow={1} gap="16px" alignItems="center">
                        <StyleListItemButton
                            onClick={handleClick}
                            selected={location.pathname.includes('/houses')}
                            sx={{
                                textTransform: 'none',
                                color: 'black',
                                fontSize: '14px',
                                px: 2,

                                fontWeight: 400,
                                borderBottom: open ? `2px solid #556cd6` : 'none',
                                borderRadius: 3,
                            }}
                        >
                            <Box width="100%" display="flex" justifyContent="space-between">
                                Жилой фонд
                                <ArrowDropDownIcon />
                            </Box>
                        </StyleListItemButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            MenuListProps={{
                                sx: {
                                    mt: 1,
                                    boxShadow: 3,
                                    borderBottom: `3px solid #556cd6`,
                                },
                            }}
                        >
                            <MenuItem
                                selected={location.pathname === '/houses'}
                                onClick={() => handleNavigate('/houses')}
                            >
                                <ListItemText primary="Все" />
                            </MenuItem>
                            <MenuItem
                                selected={location.pathname === '/houses/regions'}
                                onClick={() => handleNavigate('/houses/regions')}
                            >
                                <ListItemText primary="По регионам" />
                            </MenuItem>
                            <MenuItem
                                selected={location.pathname === '/houses/cities'}
                                onClick={() => handleNavigate('/houses/cities')}
                            >
                                <ListItemText primary="По городам" />
                            </MenuItem>
                        </Menu>

                        {navigationItems
                            .filter((item) => item.text !== 'Жилой фонд')
                            .map((item, index) => (
                                <MotionStyleListItemButton
                                    {...defaultMotionConfig}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    key={item.text}
                                    disabled={item.disabled}
                                    onClick={() => navigate(item.path)}
                                    selected={location.pathname === item.path}
                                    sx={{ px: 2 }}>
                                    <ListItemText>
                                        <Typography color="black" fontSize="14px">
                                            {item.text}
                                        </Typography>
                                    </ListItemText>
                                </MotionStyleListItemButton>
                            ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default TopSidebar;
