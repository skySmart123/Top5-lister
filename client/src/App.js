import './App.css';
import './override.css';

import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {AuthContextProvider} from './auth';
import {GlobalStoreContextProvider} from './store'
import AppBanner from './component/AppBanner'
import HomeLayoutRoute from "./layouts/HomeLayoutRoute";
import HomePage from "./pages/HomePage";
import CommunityPage from "./pages/CommunityPage";
import UserPage from "./pages/UserPage";
import AllPage from "./pages/AllPage";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import Notification from "./notification";
import {NotificationProvider} from "./notification/provider";
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
    return (
        <BrowserRouter>
            <NotificationProvider>
                <AuthContextProvider>
                    <GlobalStoreContextProvider>
                        <AppBanner/>
                        <Switch>
                            <Route path="/" exact component={SplashScreen}/>
                            <Route path="/login" exact component={LoginScreen}/>
                            <Route path="/register/" exact component={RegisterScreen}/>
                            <HomeLayoutRoute path="/home" exact component={HomePage}/>
                            <HomeLayoutRoute path="/all" exact component={AllPage}/>
                            <HomeLayoutRoute path="/user" exact component={UserPage}/>
                            <HomeLayoutRoute path="/community" exact component={CommunityPage}/>
                        </Switch>
                        <Notification/>
                    </GlobalStoreContextProvider>
                </AuthContextProvider>
            </NotificationProvider>
        </BrowserRouter>
    )
}

export default App