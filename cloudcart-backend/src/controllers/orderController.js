const prisma = require('../config/prisma');

exports.listOrders = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch orders',
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one order item is required',
      });
    }

    const productIds = items.map((item) => Number(item.productId));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const orderItems = items.map((item) => {
      const product = products.find((entry) => entry.id === Number(item.productId));
      const quantity = Number(item.quantity || 1);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      return {
        productId: product.id,
        quantity,
        price: product.price,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Unable to create order',
    });
  }
};
