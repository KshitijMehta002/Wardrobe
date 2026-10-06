const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./model/user');
const Product = require('./model/Product');
const Order = require('./model/Order');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // 1. Clear existing database collections
        console.log('Clearing old data...');
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // 2. Create Dummy Users
        console.log('Creating users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                verified: true
            },
            {
                name: 'Regular User',
                email: 'user@example.com',
                password: hashedPassword,
                role: 'user',
                verified: true
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword,
                role: 'user',
                verified: true
            }
        ];

        const createdUsers = await User.insertMany(users);
        const adminUserId = createdUsers[0]._id;
        const regularUserId = createdUsers[1]._id;
        const janeUserId = createdUsers[2]._id;

        // 3. Create Dummy Products
        console.log('Creating products...');
        const products = [
            {
                name: 'Embroidered Silk Anarkali Suit',
                description: 'Handcrafted pure silk Anarkali suit with intricate zari embroidery, paired with a matching organza dupatta and churidar.',
                price: 129.99,
                category: 'Ethnic Wear',
                stock: 25,
                imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                rating: 4.8,
                numReviews: 24
            },
            {
                name: 'Classic Floral Print Maxi Dress',
                description: 'Breezy chiffon floral maxi dress featuring flutter sleeves, a cinched waistline, and a flowy tiered silhouette.',
                price: 69.50,
                category: 'Dresses',
                stock: 40,
                imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
                rating: 4.6,
                numReviews: 18
            },
            {
                name: 'Royal Banarasi Silk Saree',
                description: 'Luxurious Banarasi silk saree with ornate golden floral motifs, zari border, and an elaborately woven pallu.',
                price: 189.00,
                category: 'Ethnic Wear',
                stock: 15,
                imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
                rating: 4.9,
                numReviews: 32
            },
            {
                name: 'Tailored Linen Blazer',
                description: 'Contemporary relaxed-fit blazer tailored from breathable European linen with notch lapels and button detailing.',
                price: 89.99,
                category: 'Western Wear',
                stock: 30,
                imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
                rating: 4.5,
                numReviews: 12
            },
            {
                name: 'Lucknowi Chikankari Kurta Set',
                description: 'Delicate Lucknowi chikankari embroidered cotton kurta paired with palazzo pants and a sheer lace-bordered dupatta.',
                price: 79.99,
                category: 'Ethnic Wear',
                stock: 35,
                imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
                rating: 4.7,
                numReviews: 29
            },
            {
                name: 'Boho Tiered Midi Skirt',
                description: 'Soft rayon tiered midi skirt featuring an elasticated drawstring waistband and subtle bohemian folk print detailing.',
                price: 49.99,
                category: 'Western Wear',
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
                rating: 4.3,
                numReviews: 15
            },
            {
                name: 'Velvet Sequin Festive Kurti',
                description: 'Plush emerald velvet kurti adorned with fine sequin and thread work, perfect for evening celebrations and weddings.',
                price: 95.00,
                category: 'Ethnic Wear',
                stock: 20,
                imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
                rating: 4.9,
                numReviews: 21
            },
            {
                name: 'Ribbed Knit Cardigan Sweater',
                description: 'Cozy oversized ribbed knit cardigan made with super-soft yarn, featuring front buttons and comfortable drop shoulders.',
                price: 59.99,
                category: 'Winter Wear',
                stock: 45,
                imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
                rating: 4.4,
                numReviews: 19
            },
            {
                name: 'Pleated Satin Evening Gown',
                description: 'Floor-length pleated satin gown with an asymmetrical off-shoulder neckline, sleek drape, and elegant silhouette.',
                price: 149.99,
                category: 'Dresses',
                stock: 18,
                imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
                rating: 4.8,
                numReviews: 27
            },
            {
                name: 'Casual Linen Co-Ord Set',
                description: 'Effortless two-piece coordinated set featuring a relaxed button-down shirt and breezy wide-leg cropped trousers.',
                price: 64.99,
                category: 'Casual Wear',
                stock: 35,
                imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
                rating: 4.6,
                numReviews: 16
            }
        ];

        const createdProducts = await Product.insertMany(products);
        const p1 = createdProducts[0];
        const p2 = createdProducts[1];
        const p3 = createdProducts[2];
        const p4 = createdProducts[3];

        // 4. Create Dummy Orders
        console.log('Creating orders...');
        const orders = [
            {
                user: regularUserId,
                items: [
                    { productId: p1._id, qty: 2, price: p1.price },
                    { productId: p2._id, qty: 1, price: p2.price }
                ],
                totalAmount: (p1.price * 2 + p2.price * 1).toString(),
                address: {
                    fullname: 'Regular User',
                    street: '123 Main St',
                    city: 'Mumbai',
                    postalCode: '400001',
                    country: 'India'
                },
                paymentId: 10001,
                status: 'delivered'
            },
            {
                user: janeUserId,
                items: [
                    { productId: p3._id, qty: 1, price: p3.price },
                    { productId: p4._id, qty: 1, price: p4.price }
                ],
                totalAmount: (p3.price * 1 + p4.price * 1).toString(),
                address: {
                    fullname: 'Jane Smith',
                    street: '456 Elm St',
                    city: 'Delhi',
                    postalCode: '110001',
                    country: 'India'
                },
                paymentId: 10002,
                status: 'pending'
            }
        ];

        await Order.insertMany(orders);

        console.log('✅ Dummy Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error importing data: ${error.message}`);
        process.exit(1);
    }
};

// Run the script
importData();
