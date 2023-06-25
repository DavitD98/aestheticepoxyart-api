const typeCtrl = require("../controllers/typeController")
const { verifyAdmin } = require("../middlewares/verifyAdmin")
const { verifyToken } = require("../middlewares/verifyToken")

const router = require(`express`).Router()


router.route(`/type`)
       .get(typeCtrl.getTypes)
       .post(verifyToken,verifyAdmin,typeCtrl.createType)

router.route(`/type/:id`)
       .put(verifyToken,verifyAdmin,typeCtrl.updateType)
       .delete(verifyToken,verifyAdmin,typeCtrl.deleteType)
       

module.exports = router       