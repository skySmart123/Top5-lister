import {createContext, useContext, useEffect, useState} from 'react'
import {useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'
import useNotification from "../notification/hook";
import {apiInstance} from '../api';
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    LOAD_ALL_YOUR_LIST: "LOAD_ALL_YOUR_LIST",
    // user lists
    LOAD_ALL_USER_LIST: "LOAD_ALL_USER_LIST",
    // all published
    LOAD_ALL_PUBLISHED_LIST: "LOAD_ALL_PUBLISHED_LIST",
    // community
    LOAD_COMMUNITY_LIST: "LOAD_COMMUNITY_LIST",

    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",

    SET_CURRENT_LIST: "SET_CURRENT_LIST",

    SET_SEARCH_KEYWORD: "SET_SEARCH_KEYWORD",
    SET_SORT_TYPE: "SET_SORT_TYPE",
    CLEAR_SEARCH_AND_SORT: "CLEAR_SEARCH_AND_SORT",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
// const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        yourList: [],

        userList: [],

        allList: [],

        communityList: [],

        currentList: null,

        search: '',
        // sort: '',
        sort: 'date-desc',

        listMarkedForDeletion: null
    });

    const history = useHistory();

    const location = useLocation();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const {auth} = useContext(AuthContext);

    const {addError} = useNotification()

    useEffect(() => {
        console.log("App: useEffect:")

        const successHandler = function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            // console.log(response)

            if (response.data.success === false) {
                addError({
                    message: response.data.message
                })
            } else {
                // return response;
            }

            return response;
        }
        const errorHandler = function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            // console.log("interceptor:", error)
            // console.log("interceptor error status code:", error.response.status)

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);

                if (error.response.data.success === false) {
                    addError({
                        message: error.response.data.message,
                    })
                }

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            // console.log(error.config);

            return Promise.reject(error);
        }

        // Add a response interceptor
        const interceptor = apiInstance.interceptors.response.use(successHandler, errorHandler);
        // Specify how to clean up after this effect:
        return () => {
            apiInstance.interceptors.response.eject(interceptor)
        }

    }, [addError])

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const {type, payload} = action;
        switch (type) {
            // clear search and sort
            case GlobalStoreActionType.CLEAR_SEARCH_AND_SORT: {
                return setStore(prevState => ({
                    ...prevState,

                    search: '',
                    // sort: '',
                    sort: 'date-desc',
                }))
            }
            // GET SEARCH KEYWORD
            case GlobalStoreActionType.SET_SEARCH_KEYWORD: {
                return setStore(prevState => ({
                    ...prevState,

                    search: payload
                }))
            }
            // GET SORT TYPE
            case GlobalStoreActionType.SET_SORT_TYPE: {
                return setStore(prevState => ({
                    ...prevState,

                    sort: payload
                }))
            }
            // GET COMMUNITY LISTS
            case GlobalStoreActionType.LOAD_COMMUNITY_LIST: {
                return setStore(prevState => ({
                    ...prevState,

                    communityList: payload
                }))
            }
            // GET ALL PUBLISHED LISTS
            case GlobalStoreActionType.LOAD_ALL_PUBLISHED_LIST: {
                return setStore(prevState => ({
                    ...prevState,

                    allList: payload
                }))
            }
            // GET ALL YOUR LISTS
            case GlobalStoreActionType.LOAD_ALL_YOUR_LIST: {
                return setStore(prevState => ({
                    ...prevState,

                    yourList: payload
                }))
            }
            // GET ALL USER LISTS
            case GlobalStoreActionType.LOAD_ALL_USER_LIST: {
                return setStore(prevState => ({
                    ...prevState,

                    userList: payload
                }))
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore(prevState => ({
                    ...prevState,

                    listMarkedForDeletion: payload
                }))
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore(prevState => ({
                    ...prevState,

                    listMarkedForDeletion: null
                }))
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore(prevState => ({
                    ...prevState,

                    currentList: payload,
                }))
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    store.clearSearchAndSort = function () {
        storeReducer({
                type: GlobalStoreActionType.CLEAR_SEARCH_AND_SORT,
            }
        )
    }
    store.setSearchKeyword = function (search) {
        storeReducer({
                // type: GlobalStoreActionType.CREATE_NEW_LIST,
                type: GlobalStoreActionType.SET_SEARCH_KEYWORD,
                payload: search
            }
        );
    }
    store.setSortType = function (sortType) {
        storeReducer({
                // type: GlobalStoreActionType.CREATE_NEW_LIST,
                type: GlobalStoreActionType.SET_SORT_TYPE,
                payload: sortType
            }
        );
    }

    store.setCurrentListForEdit = function (newList) {
        storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: newList
            }
        );
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        // console.log(auth.user)

        let payload = {
            name: "Untitled",
            items: ["", "", "", "", ""],
        };
        return api.createTop5List(payload)
            .then(response => {
                if (response.data.success === true) {
                    let newList = response.data.data.top5List;

                    store.setCurrentListForEdit(newList);

                    store.loadYourList();

                    // return newList._id;
                }
            })
    }

    // load all Community list
    store.loadCommunityList = function () {
        let search = store.search;
        let sort = store.sort;

        api.getAllTop5ListsCommunity({
            search,
            sort,
        }).then((response) => {
            // console.log(response)

            if (response.data.success === true) {
                let listArray = response.data.data;

                storeReducer({
                    type: GlobalStoreActionType.LOAD_COMMUNITY_LIST,
                    payload: listArray
                });
            } else {
                // console.log("API FAILED TO GET YOUR LIST");
            }
        }).catch((error) => {

        })
    }

    // load all published list
    store.loadAllList = function () {
        let search = store.search;
        let sort = store.sort;

        api.getAllTop5ListsPublished({
            search,
            sort,
        }).then((response) => {
            // console.log(response)
            console.log(response.data.data)

            if (response.data.success === true) {
                let listArray = response.data.data;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ALL_PUBLISHED_LIST,
                    payload: listArray
                });
            } else {
                // console.log("API FAILED TO GET PUBLISHED LIST");
            }
        }).catch(error => {
            // console.error(error)
        })
    }

    // load all your list
    store.loadYourList = async function () {
        let search = store.search;
        let sort = store.sort;

        api.getAllYourTop5Lists({
            search,
            sort,
        }).then((response) => {
            // console.log(response)

            if (response.data.success === true) {
                let listArray = response.data.data;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ALL_YOUR_LIST,
                    payload: listArray
                });
            } else {
                // console.log("API FAILED TO GET YOUR LIST");
            }
        }).catch(error => {
            // console.error(error)
        })
    }

    // load all user list
    store.loadUserList = async function () {
        let search = store.search;
        let sort = store.sort;

        api.getAllTop5ListsPublishedByUsername({
            search,
            sort
        }).then((response) => {
            // console.log(response)

            if (response.data.success === true) {
                let listArray = response.data.data;

                storeReducer({
                    type: GlobalStoreActionType.LOAD_ALL_USER_LIST,
                    payload: listArray
                });
            } else {
                // console.log("API FAILED TO GET USER LIST");
            }
        }).catch(error => {
            // console.error(error)
        })
    }

    store.reloadCurrentLists = function () {
        // console.log(location)
        switch (location.pathname) {
            case '/home':
                store.loadYourList()
                break;
            case '/all':
                store.loadAllList()
                break;
            case '/user':
                store.loadUserList()
                break;
            case '/community':
                store.loadCommunityList()
                break;
            default:
                break;
        }
    }

    store.markListForDeletion = function (top5List) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: top5List
        });
    }

    store.deleteList = function (id) {
        api.deleteTop5ListById(id)
            .then((response) => {
                if (response.data.success === true) {
                    store.loadYourList();
                }
            })
    }

    store.deleteMarkedList = function () {
        const id = store.listMarkedForDeletion._id;
        store.unmarkListForDeletion();
        store.deleteList(id);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            // payload: null
        });
    }

    store.saveCurrentList = function (listName, listItems) {
        const id = store.currentList._id;
        // const response = await api.updateTop5ListById(store.currentList._id, store.currentList);

        return api.saveTop5ListById(id, {
            name: listName,
            items: listItems,
        }).then((response) => {
            console.log(response)
            if (response.data.success === true) {
                // storeReducer({
                //     type: GlobalStoreActionType.SET_CURRENT_LIST,
                //     payload: store.currentList
                // });

                store.setCurrentListForEdit(null);

                store.loadYourList();
            }
        })/*.catch(error => {
            // console.log(error)
        }).finally(() => {
            store.setCurrentListForEdit(null);
        })*/
    }

    store.publishTop5List = function (listName, listItems) {
        const id = store.currentList._id;
        return api.publishTop5ListById(id, {
            name: listName,
            items: listItems,
        }).then((response) => {
            console.log(response)

            store.loadYourList()

            if (response.data.success === true) {

                store.setCurrentListForEdit(null);

                // store.loadYourList()
            }
        })/*.catch(error => {
            // console.log(error)
        }).finally(() => {
            store.setCurrentListForEdit(null);
        })*/
    }

    // type: dislike, like
    store.likeOrDislike = function (id, type) {
        // console.log(auth)
        if (!auth.loggedIn) return;

        return api.likeOrDislikeTop5ListById(id, {
            type
        }).then(response => {
            // console.log(response)

            if (response.data.success === true) {
                store.reloadCurrentLists()
            }
        }).catch(error => {

        });
    }

    store.increaseViews = function (id) {
        return api.increaseViewsTop5ListById(id)
            .then(response => {
                // console.log(response)

                if (response.data.success === true) {
                    store.reloadCurrentLists()
                }
            })
            .catch(error => {
                // console.log(error)
            })
    }

    store.commentOnTop5List = function (id, comment) {
        if (!auth.loggedIn) return;

        return api.commentOnTop5ListById(id, {
            comment
        })
            .then((response) => {
                // console.log('commentOnTop5ListById: ', response)

                if (response.data.success === true) {
                    store.reloadCurrentLists()
                }

                // return response;
            })
            .catch((error) => {
                // console.error(error)
                // console.log('commentOnTop5ListById: ', error)
            })
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export {GlobalStoreContextProvider};