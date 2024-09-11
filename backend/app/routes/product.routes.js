const { authJwt } = require("../middleware");
const { createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getCategories,
    getTags } = require('../controllers/product.controller');

module.exports = function (app) {
    // Set headers to allow CORS
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });


    // Create a new product
    app.post('/api/create_products', [authJwt.verifyToken], createProduct);

    // Retrieve all products
    app.get('/api/products', [authJwt.verifyToken], getAllProducts);

    // Retrieve a single product by id
    app.get('/api/one_product/:id', [authJwt.verifyToken], getProductById);

    // Update a product by id
    app.put('/api/product_update/:id', [authJwt.verifyToken], updateProduct);

    // Delete a product by id
    app.delete('/api/product_delete/:id', [authJwt.verifyToken], deleteProduct);

    // Retrieve all categories
    app.get('/api/categories', [authJwt.verifyToken], getCategories);

    // Retrieve all tags
    app.get('/api/tags', [authJwt.verifyToken], getTags);
};
