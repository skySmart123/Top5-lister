const AuthManager = require('../auth')
const express = require('express')
const Top5ListController = require('../controllers/top5list-controller')
const UserController = require('../controllers/user-controller')
const router = express.Router()

router.post('/top5list', AuthManager.Verify, Top5ListController.createTop5List)
router.put('/top5list/save/:id', AuthManager.Verify, Top5ListController.saveTop5List)
router.post('/top5list/publish/:id', AuthManager.Verify, Top5ListController.publishTop5ListById)
router.delete('/top5list/:id', AuthManager.Verify, Top5ListController.deleteTop5List)

router.get('/top5lists/my/', AuthManager.Verify, Top5ListController.getTop5ListsYours)
router.get('/top5lists/all/', Top5ListController.getTop5ListsAll)
router.get('/top5lists/user/', Top5ListController.getTop5ListsUser)
router.get('/top5lists/community/', Top5ListController.getTop5ListsCommunity)

router.post('/top5list/like/:id', AuthManager.Verify, Top5ListController.likeOrDislikeTop5List)
router.post('/top5list/views/increase/:id', Top5ListController.increaseViewsTop5List)
router.post('/top5list/comment/:id', AuthManager.Verify, Top5ListController.commentOnTop5ListById)

router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.get('/loggedIn', AuthManager.Verify, UserController.getLoggedIn)
router.get('/logout', UserController.logoutUser)

module.exports = router