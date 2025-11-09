import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/products/shop
// @desc    Get all active products from other users
// @access  Private
router.get('/shop', async (req, res) => {
  try {
    // Find all active products except the current user's products
    const products = await Product.find({ 
      isActive: true,
      user: { $ne: req.user.id },
      stock: { $gt: 0 } // Only show products with stock > 0
    })
    .populate('user', 'name username') // Include seller info
    .sort({ createdAt: -1 });

    // Log for debugging
    console.log(`Found ${products.length} products for shop view`);
    console.log('Shop products:', JSON.stringify(products, null, 2));

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get shop products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/products
// @desc    Get all products for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this product',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ max: 100 })
      .withMessage('Product name cannot exceed 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required')
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('category')
      .notEmpty()
      .withMessage('Category is required'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { name, description, price, category, stock, imageUrl } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        imageUrl: imageUrl || undefined,
        user: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product,
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    const { name, description, price, category, stock, imageUrl, isActive } = req.body;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        stock,
        imageUrl,
        isActive,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

export default router;