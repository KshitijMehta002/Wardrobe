const Order = require('../model/Order');
const sendEmail = require('../utils/sendEmail');

const getOrders = async (req, res) => {
    try {
        const order = await Order.find({}).populate('user', 'id name email').populate('items.productId', 'name price imageUrl');
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Order' , error });
    }
};
const myorders = async (req, res) => {
    try {
        const order = await Order.find({ user: req.user._id}).populate('items.productId', 'name price imageUrl');
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body; 
        if(!items || items.length === 0 || !totalAmount || !address){
            return res.status(400).json({message: 'Invalid order data'})
        }else{
            const order = new Order({
                user: req.user._id,
                items,
                totalAmount,
                address,
                paymentId
            });
            await order.save();
            const formattedAddress = typeof address === 'object' 
                ? `${address.fullname || ''}, ${address.street || ''}, ${address.city || ''}, ${address.postalCode || ''}, ${address.country || ''}`
                : address;
            const message = `Dear ${req.user.name}, \n\n Thank you for your order! Your order has been successfully created with the following details:\n\n Order ID: ${order._id}\n Total Amount: ₹${totalAmount} \nShipping Address: ${formattedAddress} \n\n We will notify you once your order is shipped. \n\n Best regards,\niWardrobe Team`;
            await sendEmail(req.user.email, 'Order created', message);
            res.status(201).json({ message : 'Order created successfully', order});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error creating Order', error });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message : 'order status upadated' , order});
        }else{
        res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error upadating order status', error });
    }
};

module.exports = { getOrders, createOrder, myorders, updateOrderStatus };
