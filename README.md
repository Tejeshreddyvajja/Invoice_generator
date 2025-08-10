# Invoice Generator

A full-stack invoice generator application built with React, Node.js, and MongoDB. This application allows users to create, manage, and send professional invoices with PDF generation capabilities.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Invoice Management**: Create, edit, delete, and view invoices
- **Customer Management**: Add and manage customer information
- **Product Management**: Maintain a catalog of products/services
- **PDF Generation**: Generate professional PDF invoices
- **Email Integration**: Send invoices directly via email
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dashboard**: Overview of invoices, customers, and business metrics

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **PDFKit** for PDF generation
- **Nodemailer** for email functionality
- **bcryptjs** for password hashing

## 📁 Project Structure

```
invoice_generator/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── customer.js
│   │   ├── invoice.js
│   │   ├── product.js
│   │   └── user.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── customers.js
│   │   ├── invoices.js
│   │   ├── products.js
│   │   └── settings.js
│   ├── services/
│   │   ├── mailer.js
│   │   └── pdf.js
│   ├── public/
│   │   ├── index.html
│   │   ├── app.js
│   │   └── styles.css
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── currencies.ts
│   │   ├── pages/
│   │   │   ├── Auth.tsx
│   │   │   ├── CreateInvoice.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Invoices.tsx
│   │   │   ├── Products.tsx
│   │   │   └── Settings.tsx
│   │   ├── state/
│   │   │   └── auth.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
├── package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tejeshreddyvajja/Invoice_generator.git
   cd Invoice_generator
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/invoice_generator
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice_generator

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   # From the root directory
   npm run dev
   # Or from backend directory
   cd backend && nodemon server.js
   ```

2. **Start the frontend development server**
   ```bash
   # In a new terminal, from the root directory
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Basic test interface: http://localhost:5000/app

#### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server**
   ```bash
   # From the root directory
   npm start
   # Or from backend directory
   cd backend && node server.js
   ```

## 📋 Available Scripts

### Root Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the backend in development mode with nodemon

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/pdf` - Generate PDF
- `POST /api/invoices/:id/email` - Send invoice via email

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

## 🌐 Deployment

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
EMAIL_FROM=your_from_email
```

### Deploy to Heroku

1. **Install Heroku CLI** and login
2. **Create a new Heroku app**
   ```bash
   heroku create your-invoice-app
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. **Connect your GitHub repository** to Railway
2. **Set environment variables** in Railway dashboard
3. **Deploy automatically** on push to main branch

### Deploy to Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Set build and start commands:**
   - Build Command: `npm run build:frontend`
   - Start Command: `npm start`
4. **Set environment variables**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Tejesh Reddy Vajja** - [GitHub](https://github.com/Tejeshreddyvajja)

## 🙏 Acknowledgments

- Built with React and Node.js
- PDF generation powered by PDFKit
- Styling with Tailwind CSS
- Icons from various open-source icon libraries

## 📞 Support

If you have any questions or run into issues, please:

1. Check the existing [Issues](https://github.com/Tejeshreddyvajja/Invoice_generator/issues)
2. Create a new issue if your problem isn't already documented
3. Include as much detail as possible in your issue report

---

Made with ❤️ by Tejesh Reddy Vajja
