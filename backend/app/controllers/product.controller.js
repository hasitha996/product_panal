const db = require('../models'); // Sequelize models should be in this directory
const Product = db.product;
const Category = db.category;
const Tag = db.tag;
const User = db.user;

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { brand, description, members, categories, tags, nextMeeting } = req.body;
        const product = await Product.create({
            brand,
            description,
            members: JSON.stringify(members), // Store members as a JSON string
            category: JSON.stringify(categories), // Store category as a JSON string
            tag: JSON.stringify(tags), // Store tag as a JSON string
            nextMeeting
        });

        
        // Update associated categories and tags
        if (categories) await product.setCategories(categories);
        if (tags) await product.setTags(tags);
        
        res.json({
            products: product
        }, 200);
    } catch (error) {
        console.error("Error creating product", error);
        res.status(500).json({ message: 'Failed to create product', error });
    }
};


// Retrieve all products, categories, and tags in separate arrays

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category, as: 'Categories', through: { attributes: [] } },
                { model: Tag, as: 'Tags', through: { attributes: [] } }
            ]
        });

        const categories = await Category.findAll();
        const tags = await Tag.findAll();
        const members = await User.findAll();

        const productsWithParsedMembers = products.map(product => {
            let parsedMembers = [];
            try {
                parsedMembers = JSON.parse(product.members);
            } catch (e) {
                console.error("Error parsing members for product", product.id, e);
                // Handle parsing error, default to empty array
            }

            return {
                ...product.toJSON(),
                members: Array.isArray(parsedMembers) ? parsedMembers.map(mem => ({
                    id: mem.id,
                    name: mem.first_name
                })) : [], // Default to empty array if parsedMembers is not an array
                categories: product.Categories.map(cat => ({
                    id: cat.id,
                    name: cat.name
                })),
                tags: product.Tags.map(tag => ({
                    id: tag.id,
                    name: tag.name
                }))
            };
        });

        res.status(200).json({
            products: productsWithParsedMembers,
            categories,
            tags,
            members
        });
    } catch (error) {
        console.error("Error retrieving products", error);
        res.status(500).json({ message: 'Failed to retrieve products', error });
    }
};



// Retrieve a single product by id
exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
      // Fetch product by ID along with its associated members, categories, and tags
      const product = await Product.findByPk(id, {
        include: [
          { model: Category, through: { attributes: [] } },
          { model: Tag, through: { attributes: [] } }
        ]
      });
  
      // Check if the product exists
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Return the product data
      return res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a product by id
exports.updateProduct = async (req, res) => {
    try {
        const { brand, description, members, categories, tags, nextMeeting } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Update product details
        product.brand = brand;
        product.description = description;
        product.members = JSON.stringify(members);
        product.nextMeeting = nextMeeting;

        await product.save();

        // Update associated categories and tags
        if (categories) await product.setCategories(categories);
        if (tags) await product.setTags(tags);

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({ message: 'Failed to update product', error });
    }
};

// Delete a product by id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};

// Retrieve all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error("Error retrieving categories", error);
        res.status(500).json({ message: 'Failed to retrieve categories', error });
    }
};

// Retrieve all tags
exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json(tags);
    } catch (error) {
        console.error("Error retrieving tags", error);
        res.status(500).json({ message: 'Failed to retrieve tags', error });
    }
};
