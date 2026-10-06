const Order = require('../model/Order');
const User = require('../model/user');
const Product = require('../model/Product');

const getAdminStatus = async ( req, res) => {
    try{
        const totalUsers  = await User.countDocuments({});
        const totalOrders  = await Order.countDocuments({});
        const totalProduct  = await Product.countDocuments({});

        const orders = await Order.find({});
        const totalRevenueData = orders.reduce((acc, order) => acc + Number(order.totalAmount), 0)
        res.json({
            totalUsers,
            totalOrders,
            totalProduct,
            toalRevenue: totalRevenueData
        });
    }catch(error){
        res.status(500).json({ message: 'Error fetching stats', error});
    }
}

module.exports = {getAdminStatus};