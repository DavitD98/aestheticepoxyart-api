const userCtrl = require("../controllers/userControllers")
const { verifyToken } = require("../middlewares/verifyToken")

const router = require(`express`).Router()

router.post(`/register`,userCtrl.register)
router.post(`/login`,userCtrl.login)
router.get(`/logout`,userCtrl.logout)
router.get(`/infor`,verifyToken,userCtrl.getUser)
router.put(`/add_cart`,verifyToken,userCtrl.addCart)
router.get(`/history`,verifyToken,userCtrl.getHistory)
router.put(`/edit/:id`,verifyToken,userCtrl.editUser)
router.put(`/passwordEdit/:id`,verifyToken,userCtrl.editPassword)


module.exports = router