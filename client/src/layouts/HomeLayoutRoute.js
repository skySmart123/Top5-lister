import React from 'react';
import { Route } from 'react-router-dom';
import Navigation from "../component/Navigation";
// import Statusbar from "../components/Statusbar";

const HomeLayout = ({ children }) => (
    <div className="home-overall-wrapper">
        <Navigation />
        <div className="inner-content-wrapper">
        {children}
        </div>
        {/*<Statusbar />*/}
    </div>
);

const HomeLayoutRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            <HomeLayout>
                <Component {...props} />
            </HomeLayout>
        )} />
    )
};

export default HomeLayoutRoute;