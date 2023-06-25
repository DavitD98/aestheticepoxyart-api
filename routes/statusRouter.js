const statusCtrl = require("../controllers/statusController")
const { verifyAdmin } = require("../middlewares/verifyAdmin")
const { verifyToken } = require("../middlewares/verifyToken")

const router = require(`express`).Router()

router.route(`/status`)
       .get(statusCtrl.getStatuses)
       .post(verifyToken,verifyAdmin,statusCtrl.createStatus)

router.route(`/status/:id`)
       .put(verifyToken,verifyAdmin,statusCtrl.updateStatus)
       .delete(verifyToken,verifyAdmin,statusCtrl.deleteStatus)
       
module.exports = router       