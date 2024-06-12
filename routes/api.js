const express = require('express');
const router = express.Router();
const { authJwt, verifySignUp } = require("../middleware");


/*product */
const productController = require('../controllers/products.controller');
router.post("/products", productController.create);
router.get("/products", productController.findAll);
router.get("/products/:id", productController.findOne);
router.put("/products/:id", productController.update);
router.delete("/products/:id", productController.delete);
router.delete("/products", productController.deleteAll);

/*item */
const itemController = require('../controllers/item.controller');
router.post('/items', itemController.create);
router.get('/items', itemController.findAll);
router.get('/items/:id', itemController.findOne);
router.put('/items/:id', itemController.update);
router.delete('/items/:id', itemController.delete);
router.delete('/items', itemController.deleteAll);

/*category*/
const productCategoryController = require('../controllers/productcategories.controller');

router.post('/productcategories', productCategoryController.create);
router.get('/productcategories', productCategoryController.findAll);
router.get('/productcategories/:id', productCategoryController.findOne);
router.put('/productcategories/:id', productCategoryController.update);
router.delete('/productcategories/:id', productCategoryController.delete);
router.delete('/productcategories',productCategoryController.deleteAll);

/*sub_category*/
const subcategoryController = require('../controllers/subcategories.controller');

router.post('/subcategories',subcategoryController.create);
router.get('/subcategories',subcategoryController.findAll);
router.get('/subcategories/:id',subcategoryController.findOne);
router.put('/subcategories/:id',subcategoryController.update);
router.delete('/subcategories/:id',subcategoryController.delete);
router.delete('/subcategories',subcategoryController.deleteAll);

/*product image*/
const productImageController = require('../controllers/productImage.controller');

router.post('/productImages', productImageController.createProductImage);
router.get('/productImages', productImageController.getAllProductImages);
router.delete('/productImages/:id', productImageController.deleteProductImage);
router.delete('/productImages', productImageController.deleteAllProductImages);

/*item image*/
const itemImageController = require('../controllers/item_image.controller');
router.post('/itemImages', itemImageController.createItemImage);
router.get('/itemImages', itemImageController.getAllItemImages);
router.delete('/itemImages/:id', itemImageController.deleteItemImage);
router.delete('/itemImages', itemImageController.deleteAllItemImages);

/*product_variation*/
const productVariationController = require('../controllers/product_variation.controller');

// Define your routes
router.get('/product-variations', productVariationController.findAll);
router.get('/product-variations/:id', productVariationController.findOne);
router.post('/product-variations', productVariationController.create);
router.put('/product-variations/:id', productVariationController.update);
router.delete('/product-variations/:id', productVariationController.delete);
router.delete('/product-variations', productVariationController.deleteAll);

/*product_color*/
const productColorController = require('../controllers/product_color.controller');
router.post('/product-colors', productColorController.create);
router.get('/product-colors', productColorController.findAll);
router.get('/product-colors/:id', productColorController.findOne);
router.put('/product-colors/:id', productColorController.update);
router.delete('/product-colors/:id', productColorController.delete);
router.delete('/product-colors', productColorController.deleteAll);

/*promotions*/
const promotionController = require('../controllers/promotions.controller');
router.post('/promotions', promotionController.create);
router.get('/promotions', promotionController.findAll);
router.get('/promotions/:id', promotionController.findOne);
router.put('/promotions/:id', promotionController.update);
router.delete('/promotions/:id', promotionController.delete);
router.delete('/promotions', promotionController.deleteAll);

/* User Auth Api */
const userController = require("../controllers/user.controller");
router.post("/signup", [verifySignUp.checkDuplicateUsernameOrEmail], userController.signup);
router.post("/signin", userController.signin); // This line should have a callback function defined
router.get("/admins", [authJwt.verifyToken, authJwt.isRootAdmin], userController.getAllAdmins); //Only rootadmin can access
router.get("/users", [authJwt.verifyToken, authJwt.isAdmin], userController.getAllUsers); // Only admins can access
router.get("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.getUserById);
router.get("/users/username/:username", [authJwt.verifyToken, authJwt.isAdmin], userController.getUserByUsername);
router.patch("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.updateUser); // Only admins can update
router.patch("/users/:id/password", [authJwt.verifyToken], userController.updateUserPassword); // User can update password
router.delete("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUser); // Only admins can delete
router.delete("/users", [authJwt.verifyToken, authJwt.isAdmin], userController.deleteAllUsers); // Use with extreme caution

module.exports = router;
