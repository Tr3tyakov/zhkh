import { ListItemButton, Menu, Typography } from '@mui/material';
import { IMenuBar } from './menuBar.interfaces.ts';

export const MenuBar = <T,>({ contextMenu, handleClose, data, currentElement }: IMenuBar<T>) => {
    return (
        <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
            }
            slotProps={{
                list: {
                    sx: { padding: '6px' },
                },
            }}
        >
            {data.map((item) => {
                const title =
                    typeof item.title === 'function'
                        ? currentElement
                            ? item.title(currentElement)
                            : ''
                        : item.title;

                return (
                    <ListItemButton
                        disabled={item.disabled}
                        key={title}
                        sx={{ borderRadius: 2, marginTop: '5px' }}
                        onClick={
                            currentElement ? () => item.function(currentElement) : item.function
                        }
                    >
                        {item.icon}
                        <Typography ml="10px" fontSize="14px">
                            {title}
                        </Typography>
                    </ListItemButton>
                );
            })}
        </Menu>
    );
};
