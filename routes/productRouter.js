const productCtrl = require("../controllers/productController")
const { verifyAdmin } = require("../middlewares/verifyAdmin")
const { verifyToken } = require("../middlewares/verifyToken")
const router = require(`express`).Router()


router.route(`/products`)
       .get(productCtrl.getProducts)
       .post(verifyToken,verifyAdmin, productCtrl.createProduct)
      
router.route(`/products/:id`)
       .put(verifyToken,verifyAdmin,productCtrl.updateProduct)
       .delete(verifyToken,verifyAdmin,productCtrl.deleteProduct)


module.exports = router
       
   
       


