const orderCtrl = require("../controllers/orderController")
const { verifyAdmin } = require("../middlewares/verifyAdmin")
const { verifyToken } = require("../middlewares/verifyToken")

const router = require(`express`).Router()


router.route(`/order`)
      .get(verifyToken,verifyAdmin,orderCtrl.getOrders)
      .post(verifyToken,orderCtrl.createOrder)

router.patch(`/order/:id`,verifyToken,verifyAdmin,orderCtrl.updateOrder)      



module.exports = router      