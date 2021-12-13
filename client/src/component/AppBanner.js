import {useContext, useState} from 'react';
import {Link, useHistory} from 'react-router-dom'
import AuthContext from '../auth';
// import {GlobalStoreContext} from '../store'
// import EditToolbar from '../components/EditToolbar'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function AppBanner() {
    const {auth} = useContext(AuthContext);
    // const {store} = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const history = useHistory();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const handleMenuLogin = () => {
        handleMenuClose();

        history.push('/login');
    }
    const handleMenuRegister = () => {
        handleMenuClose();

        history.push('/register');
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuLogin}>Login</MenuItem>
            <MenuItem onClick={handleMenuRegister}>Create New Account</MenuItem>
        </Menu>
    );
    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    // let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        // if (store.currentList) {
        //     editToolbar = <EditToolbar />;
        // }
    }

    function getAccountMenu() {
        return auth.loggedIn ? <Button
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            color="inherit"
            onClick={handleProfileMenuOpen}
        >
            {auth.user.firstName.charAt(0).toUpperCase() + auth.user.lastName.charAt(0).toUpperCase()}
        </Button> : <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
        >
            <AccountCircle/>
        </IconButton>
            ;
    }

    return (
        <Box className="HeaderNavbar" sx={{flexGrow: 0}}>
            <AppBar position="static">
                <Toolbar sx={{height: '64px'}}>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{display: {xs: 'block', sm: 'block'}, flexGrow: 1}}
                    >
                        <Link style={{textDecoration: 'none', color: 'white'}} to='/'>T<sup>5</sup>L</Link>
                    </Typography>
                    {/*<Box sx={{flexGrow: 1}}>*/}
                    {/*    {editToolbar}*/}
                    {/*</Box>*/}
                    <Box sx={{display: {xs: 'flex', md: 'flex'}}}>
                        {getAccountMenu()}
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}