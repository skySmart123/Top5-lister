/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})
export const apiInstance = api;

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const createTop5List = (payload) => api.post(`/top5list/`, payload)
export const saveTop5ListById = (id, payload) => api.put(`/top5list/save/${id}`, payload)
export const publishTop5ListById = (id, payload) => api.post(`/top5list/publish/${id}`, payload)
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`)

export const getAllYourTop5Lists = (params) => api.get(`/top5lists/my/`, {params})
export const getAllTop5ListsPublished = (params) => api.get(`/top5lists/all/`, {params})
export const getAllTop5ListsPublishedByUsername = (params) => api.get(`/top5lists/user/`, {params})
export const getAllTop5ListsCommunity = (params) => api.get(`/top5lists/community/`, {params})

export const likeOrDislikeTop5ListById = (id, payload) => api.post(`/top5list/like/${id}`, payload)
export const increaseViewsTop5ListById = (id) => api.post(`/top5list/views/increase/${id}`)
export const commentOnTop5ListById = (id, payload) => api.post(`/top5list/comment/${id}`, payload)

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.post(`/login/`, payload)
export const logoutUser = () => api.get(`/logout/`)

const apis = {
    // only your lists
    getAllYourTop5Lists,
    // all published lists
    getAllTop5ListsPublished,
    // search user's lists by username
    getAllTop5ListsPublishedByUsername,
    // all community lists
    getAllTop5ListsCommunity,

    createTop5List,
    saveTop5ListById,
    publishTop5ListById,
    deleteTop5ListById,

    likeOrDislikeTop5ListById,
    increaseViewsTop5ListById,
    commentOnTop5ListById,

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
