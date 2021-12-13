import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'
import useNotification from "../notification/hook";

const AuthContext = createContext();
// console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
}

function AuthContextProvider(props) {

    const {addError} = useNotification()

    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = function () {
        api.getLoggedIn()
            .then(response => {
                if (response.data.success === true) {
                    authReducer({
                        type: AuthActionType.GET_LOGGED_IN,
                        payload: {
                            loggedIn: response.data.data.loggedIn,
                            user: response.data.data.user
                        }
                    });
                }
            })
    }

    auth.registerUser = function(userData, store) {
        api.registerUser(userData)
            .then(response => {

                if (response.data.success === true) {
                    // authReducer({
                    //     type: AuthActionType.REGISTER_USER,
                    //     payload: {
                    //         user: response.data.user
                    //     }
                    // })
                    // history.push("/");
                    // store.loadIdNamePairs();

                    addError({
                        message: response.data.message,
                        status: 'success',
                    })

                    history.push("/login")
                }
            })
    }

    auth.loginUser = function(userData, store) {
        api.loginUser(userData)
            .then(response => {
                if (response.data.success === true) {
                    authReducer({
                        type: AuthActionType.LOGIN_USER,
                        payload: {
                            user: response.data.data.user
                        }
                    })

                    addError({
                        message: response.data.message,
                        status: 'success',
                    })

                    history.push("/home");
                }
            })
    }

    auth.logoutUser = async function(store) {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: {}
            })
            history.push('/');
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };