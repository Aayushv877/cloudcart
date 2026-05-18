const prisma = require('../config/prisma');

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'AirPods Pro (2nd Gen)', brand: 'Apple', price: 249, oldPrice: 299, category: 'Electronics', icon: 'Headphones', badge: 'sale', rating: 5, stock: 42 },
  { id: 2, name: 'Nike Air Max 270', brand: 'Nike', price: 150, category: 'Fashion', icon: 'Footprints', badge: 'hot', rating: 4, stock: 30 },
  { id: 3, name: 'MacBook Air M3', brand: 'Apple', price: 1099, category: 'Electronics', icon: 'Laptop', badge: 'new', rating: 5, stock: 12 },
  { id: 4, name: 'Clean Code', brand: 'Robert Martin', price: 39, category: 'Books', icon: 'BookOpen', rating: 4, stock: 80 },
];

exports.listProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};

    if (category) {
      where.category = String(category);
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { brand: { contains: String(search), mode: 'insensitive' } },
        { category: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { vendor: true },
    });

    res.json({
      success: true,
      data: products.length ? products : FALLBACK_PRODUCTS,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch products',
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, brand, price, category, oldPrice, icon, badge, rating, stock, description, vendorId } = req.body;

    if (!name || !brand || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, brand, price, and category are required',
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        price: Number(price),
        category,
        oldPrice: oldPrice === undefined ? undefined : Number(oldPrice),
        icon,
        badge,
        rating: rating === undefined ? undefined : Number(rating),
        stock: stock === undefined ? undefined : Number(stock),
        description,
        vendorId: vendorId === undefined ? undefined : Number(vendorId),
      },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Unable to create product',
    });
  }
};
