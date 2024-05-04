const ProductController = require("@controllers/product.controller");
const router = require('express').Router();

router.get("/", ProductController.getAllProducts);

module.exports = router;