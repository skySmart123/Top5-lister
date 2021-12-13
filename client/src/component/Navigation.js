import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import HomeIcon from "@mui/icons-material/HomeOutlined";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';

import {useContext, useEffect, useState} from 'react'
import AuthContext from '../auth'

import {
    Link,
    matchPath, useHistory,
    useLocation, useParams,
} from "react-router-dom";
import {TextField} from "@mui/material";
import GlobalStoreContext from "../store";
import SortMenu from "./SortMenu";

// function LinkTab(props) {
//     return (
//         <Tab
//             component="a"
//             onClick={(event) => {
//                 event.preventDefault();
//             }}
//             {...props}
//         />
//     );
// }
//
// export default function Navigation() {
//     const [value, setValue] = React.useState(0);
//
//     const handleChange = (event, newValue) => {
//         setValue(newValue);
//     };
//
//     return (
//         <Box sx={{ width: '100%' }}>
//             <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
//                 <LinkTab label="Page One" href="/" />
//                 <LinkTab label="Page Two" href="/login" />
//                 <LinkTab label="Page Three" href="/register" />
//             </Tabs>
//         </Box>
//     );
// }

function useRouteMatch(patterns) {
    const {pathname} = useLocation();
    // console.log(pathname)

    for (let i = 0; i < patterns.length; i += 1) {
        const pattern = patterns[i];
        // const possibleMatch = matchPath(pattern, pathname);
        const possibleMatch = matchPath(pathname, {
            path: pattern,
            exact: true,
            strict: false
        });
        // console.log(possibleMatch)
        if (possibleMatch !== null) {
            // console.log(possibleMatch)
            return possibleMatch;
        }
    }

    return null;
}

export default function Navigation(props) {
    // console.log('props:', props)

    // You need to provide the routes in descendant order.
    // This means that if you have nested routes like:
    // users, users/new, users/edit.
    // Then the order should be ['users/add', 'users/edit', 'users'].
    // const routeMatch = useRouteMatch(["/home", "/all", "/user", "/community"]);
    const routeMatch = useRouteMatch(["/user", "/home", "/all", "/community"]);
    // console.log(routeMatch)
    // {path: '/community', url: '/community', isExact: true, params: {…}}
    // const currentTab = routeMatch?.pattern?.path;
    const currentTab = routeMatch?.path;
    // console.log(currentTab)

    const {auth} = useContext(AuthContext);

    const {store} = useContext(GlobalStoreContext);

    const [keyword, setKeyword] = useState('')

    // const history = useHistory()
    const location = useLocation()
    // const params = useParams()
    const handleSearch = (event) => {
        if (event.code === 'Enter') {
            const search = event.target.value;

            store.setSearchKeyword(search);

            // console.log(location)
            // console.log(params)
            // history.push({
            //     pathname:
            // })
        }
    }


    useEffect(() => {
        console.log('location changed', location)

        store.clearSearchAndSort()
    }, [location]);

    useEffect(() => {
        setKeyword(store.search)
    }, [store.search])


    function handleSearchChange(event) {
        setKeyword(event.target.value)
    }

    return (
        <div className="navigation-wrapper">
            <Tabs sx={{display: 'inline-block'}} value={currentTab} aria-label="icon tabs example">
                <Tab
                    icon={<HomeIcon fontSize="large"/>}
                    aria-label="Your Lists"
                    value="/home"
                    to="/home"
                    component={Link}
                    disabled={!auth.loggedIn}
                />
                <Tab
                    icon={<GroupsIcon fontSize="large"/>}
                    aria-label="All Lists"
                    value="/all"
                    to="/all"
                    component={Link}
                />
                <Tab
                    icon={<PersonIcon fontSize="large"/>}
                    aria-label="User Lists"
                    value="/user"
                    to="/user"
                    component={Link}
                />
                <Tab
                    icon={<FunctionsOutlinedIcon fontSize="large"/>}
                    aria-label="Community Lists"
                    value="/community"
                    to="/community"
                    component={Link}
                />
            </Tabs>

            {/*  search input */}
            <TextField
                // value={store.search}
                value={keyword}
                onChange={handleSearchChange}
                onKeyPress={(event) => {
                handleSearch(event)
            }} sx={{
                // display: 'inline-block',
                marginLeft: '10px',
                marginTop: '8px'
            }} size="small" margin="normal"/>

            {/*  sort menu*/}
            <SortMenu />
        </div>
    );
}
