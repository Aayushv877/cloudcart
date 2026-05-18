const prisma = require('../config/prisma');

exports.getCart = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch cart',
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product id is required',
      });
    }

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId: Number(productId),
        },
      },
      update: {
        quantity: { increment: Number(quantity) },
      },
      create: {
        userId,
        productId: Number(productId),
        quantity: Number(quantity),
      },
      include: { product: true },
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Unable to update cart',
    });
  }
};
