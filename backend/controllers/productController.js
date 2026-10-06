const Product = require('../model/Product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const product = await Product.find({});
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
};
const getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl: bodyImageUrl } = req.body;
        let imageUrl = bodyImageUrl || '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log(result);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        })
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl: bodyImageUrl } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            if (bodyImageUrl) {
                product.imageUrl = bodyImageUrl;
            }
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log(result);
                product.imageUrl = result.secure_url;
            }
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }else{
        res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        }else{
        res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getProducts, getProductsById, createProduct, updateProduct, deleteProduct };