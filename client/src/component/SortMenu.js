import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import GlobalStoreContext from "../store";
import {useContext} from "react";
import {SortOutlined} from "@mui/icons-material";

export default function SortMenu() {
    const {store} = useContext(GlobalStoreContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleSort(sortType) {
        console.log(sortType)

        store.setSortType(sortType)
    }

    // const sortType = store.sort? store.sort: 'date-desc';

    return (
        <React.Fragment>
            <Box sx={{
                display: 'flex', alignItems: 'center', textAlign: 'center',
                marginLeft: 'auto',
            }}>
                <Typography sx={{}}>
                    SORT BY
                </Typography>
                <Tooltip title="Account settings">
                    <IconButton onClick={handleClick} size="large" sx={{mx: 2}}>
                        <SortOutlined/>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem
                    selected={store.sort === 'date-desc'}
                    onClick={(event) => {
                        handleSort('date-desc')
                    }}
                >
                    Publish Date (Newest)
                </MenuItem>
                <MenuItem
                    selected={store.sort === 'date-asc'}
                    onClick={(event) => {
                        handleSort('date-asc')
                    }}
                >
                    Publish Date (Oldest)
                </MenuItem>
                <MenuItem
                    selected={store.sort === 'views-desc'}
                    onClick={(event) => {
                        handleSort('views-desc')
                    }}
                >
                    Views
                </MenuItem>
                <MenuItem
                    selected={store.sort === 'likes-desc'}
                    onClick={(event) => {
                        handleSort('likes-desc')
                    }}
                >
                    Likes
                </MenuItem>
                <MenuItem
                    selected={store.sort === 'dislikes-desc'}
                    onClick={(event) => {
                        handleSort('dislikes-desc')
                    }}
                >
                    Dislikes
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
