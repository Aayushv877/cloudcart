const prisma = require('../config/prisma');

exports.listVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: { products: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch vendors',
    });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const { name, category, commission, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required',
      });
    }

    const vendor = await prisma.vendor.create({
      data: {
        name,
        category,
        commission: commission === undefined ? undefined : Number(commission),
        status,
      },
    });

    res.status(201).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Unable to create vendor',
    });
  }
};
