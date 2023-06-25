const categoryCtrl = require("../controllers/categoryController")
const { verifyAdmin } = require("../middlewares/verifyAdmin")
const { verifyToken } = require("../middlewares/verifyToken")
const router = require(`express`).Router()

router.route(`/category`)
       .get(categoryCtrl.getCategories)
       .post(verifyToken,verifyAdmin, categoryCtrl.createCategory)

router.route(`/category/:id`)
       .put(verifyToken,verifyAdmin,categoryCtrl.updateCategory)
       .delete(verifyToken,verifyAdmin,categoryCtrl.deleteCategory)
       
module.exports = router       