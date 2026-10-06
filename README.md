# Wardrobe — Full-Stack E-Commerce Web App

A full-stack e-commerce web application built from scratch using React, Node.js, Express, and MongoDB. It handles everything from user registration with email OTP verification and product browsing to secure Razorpay checkout and a dedicated admin management dashboard.

---

## 💡 About the Project

I built this project to simulate a real-world fashion e-commerce store with an end-to-end shopping experience. The platform supports both customer shopping flows and store management for admins.

### What it does:
- **Authentication**: Users can sign up with email and verify their account using an OTP sent via Nodemailer. Login sessions are secured using JWT.
- **Product Discovery**: Browse clothing items, filter by categories, check stock levels, view product images, and read ratings.
- **Cart & State Management**: Redux Toolkit manages the shopping cart across page navigation with local persistence.
- **Checkout & Payments**: Integrated with Razorpay for test transactions (Cards, UPI, NetBanking) with HMAC signature verification on the server side, alongside a Cash on Delivery option.
- **Order Tracking**: Users can view their past orders, total breakdowns, and check live delivery status.
- **Admin Control Panel**: Admins can view store sales analytics, upload new products with multiple images (stored on Cloudinary), update inventory, view all customer orders, and update shipping stages.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Redux Toolkit, React Icons, CSS
- **Backend**: Node.js, Express.js 5, Mongoose (MongoDB ODM)
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary (handled via Multer)
- **Payment Gateway**: Razorpay Node SDK
- **Email Service**: Nodemailer (Gmail SMTP for OTP verification)

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── config/          # MongoDB connection & Cloudinary setup
│   ├── controllers/     # Business logic for auth, products, orders, payments, analytics
│   ├── middleware/      # JWT verification & admin route protectors
│   ├── model/           # Mongoose models (User, Product, Order)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Nodemailer mailer helper
│   ├── seed.js          # Demo data seeding script
│   └── index.js         # Backend server entry point
│
└── frontend/
    ├── src/
    │   ├── admin/       # Admin pages (Dashboard, Add/Edit Product, Orders, Users)
    │   ├── components/  # Reusable UI components (Navbar, Footer, ProductCard, etc.)
    │   ├── context/     # Auth state context
    │   ├── pages/       # Customer pages (Home, Shop, ProductDetail, Cart, Checkout, Profile)
    │   ├── redux/       # Redux store & cartSlice
    │   └── styles/      # Stylesheets
    ├── vercel.json      # Vercel deployment rewrites
    └── vite.config.js   # Vite config & local API proxy
```

---

## 🚀 Running Locally

If you want to clone this repository and run it locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd p1
```

### 2. Backend Setup
1. Move into the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```
4. (Optional) Seed demo products into your database:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal window and move into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🚢 Deployment Notes

This project is structured for easy deployment across separate hosting platforms:

- **Backend (Render)**:
  - Root directory set to `backend`
  - Build command: `npm install`
  - Start command: `npm start`
  - Environment variables added in the Render dashboard.

- **Frontend (Vercel)**:
  - Root directory set to `frontend`
  - Output directory: `dist`
  - Uses `frontend/vercel.json` to proxy `/api/*` requests to the Render backend and handle React Router single-page navigation without 404 errors.

---

## 📬 Key API Routes

- `POST /api/auth/register` — Register user & send OTP email
- `POST /api/auth/verify-otp` — Verify OTP and complete registration
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/products` — Fetch all products (with filters/categories)
- `POST /api/products` — Upload product with images to Cloudinary (Admin only)
- `POST /api/orders` — Create a new customer order
- `GET /api/orders/myorders` — Fetch logged-in user order history
- `POST /api/payments/order` — Create Razorpay order ID
- `POST /api/payments/verify` — Verify Razorpay HMAC payment signature
- `GET /api/analytics` — Fetch sales summary, orders, and user stats (Admin only)

---

## 👨‍💻 Author

Built by **Kshitij**  
Feel free to star the repo or connect if you find this helpful!
