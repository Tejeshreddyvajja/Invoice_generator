# 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying the Invoice Generator application to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Node.js 18+** installed locally
2. **MongoDB database** (local or MongoDB Atlas)
3. **Email credentials** (for sending invoices - optional)
4. **Git** repository access

## 🔧 Environment Variables

All deployment platforms will need these environment variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

## 🌐 Platform-Specific Deployment

### 1. Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Steps
```bash
# 1. Login to Heroku
heroku login

# 2. Create a new Heroku app
heroku create your-invoice-app-name

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secure_jwt_secret
heroku config:set JWT_EXPIRE=7d
# Add other environment variables as needed

# 4. Deploy
git push heroku master
```

#### MongoDB Setup
- Use MongoDB Atlas (free tier available)
- Get connection string from Atlas dashboard
- Set as MONGO_URI environment variable

---

### 2. Railway Deployment

#### Prerequisites
- Railway account
- GitHub repository connected

#### Steps
1. **Connect GitHub Repository**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub account
   - Select the Invoice_generator repository

2. **Configure Environment Variables**
   - In Railway dashboard, go to Variables tab
   - Add all required environment variables

3. **Deploy**
   - Railway will automatically deploy on push to main/master
   - Uses `railway.json` configuration file

#### MongoDB Setup
- Add MongoDB service in Railway
- Use the generated connection string as MONGO_URI

---

### 3. Render Deployment

#### Prerequisites
- Render account
- GitHub repository

#### Steps
1. **Create Web Service**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: invoice-generator
   - **Environment**: Node
   - **Build Command**: `npm run deploy`
   - **Start Command**: `node backend/server.js`
   - **Health Check Path**: `/api/health`

3. **Set Environment Variables**
   - Add all required environment variables in Render dashboard

4. **Deploy**
   - Click "Create Web Service"
   - Uses `render.yaml` configuration file

#### MongoDB Setup
- Create MongoDB service in Render
- Use connection string as MONGO_URI

---

### 4. Vercel Deployment

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps
1. **Import Project**
   - Go to [Vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - Add all required environment variables

3. **Deploy**
   - Vercel will automatically deploy
   - Uses `vercel.json` configuration file

**Note**: Vercel is primarily for serverless functions. For a full-stack app with persistent connections, consider other platforms.

---

### 5. Docker Deployment

#### Prerequisites
- Docker and Docker Compose installed

#### Steps

**Option A: Simple Docker**
```bash
# 1. Build the image
npm run docker:build

# 2. Run the container
npm run docker:run
```

**Option B: Docker Compose (Recommended)**
```bash
# 1. Create .env file for Docker Compose
cp .env.example .env
# Edit .env with your values

# 2. Start all services
npm run docker:compose:up

# 3. Stop all services
npm run docker:compose:down
```

#### What Docker Compose Includes
- **Application server** (Node.js)
- **MongoDB database**
- **Redis cache** (optional)
- **Nginx reverse proxy** (optional)

---

### 6. Digital Ocean App Platform

#### Steps
1. **Create App**
   - Go to Digital Ocean Console
   - Apps → Create App
   - Connect GitHub repository

2. **Configure App**
   - **Name**: invoice-generator
   - **Build Command**: `npm run deploy`
   - **Run Command**: `node backend/server.js`
   - **HTTP Port**: 5000

3. **Add Database**
   - Add MongoDB managed database
   - Use connection string as MONGO_URI

4. **Set Environment Variables**
   - Add all required environment variables

---

### 7. AWS EC2 Deployment

#### Prerequisites
- AWS account
- EC2 instance running

#### Steps
```bash
# 1. Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 2. Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb-server

# 3. Clone repository
git clone https://github.com/Tejeshreddyvajja/Invoice_generator.git
cd Invoice_generator

# 4. Install dependencies and build
npm run deploy

# 5. Create .env file
cp .env.example backend/.env
# Edit backend/.env with your values

# 6. Install PM2 for process management
npm install -g pm2

# 7. Start application
pm2 start backend/server.js --name invoice-generator
pm2 startup
pm2 save
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change default JWT_SECRET to a strong random value
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS on your domain
- [ ] Set up MongoDB authentication
- [ ] Configure CORS for your domain
- [ ] Set strong MongoDB passwords
- [ ] Enable MongoDB SSL/TLS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database

---

## 🏃‍♂️ Quick Deployment (Recommended)

For the fastest deployment experience:

### Option 1: Railway (Easiest)
1. Fork this repository
2. Sign up at [Railway.app](https://railway.app)
3. Connect GitHub and select your fork
4. Add environment variables
5. Deploy automatically

### Option 2: Render (Great for beginners)
1. Fork this repository
2. Sign up at [Render.com](https://render.com)
3. Create new Web Service
4. Connect repository and set build/start commands
5. Add environment variables

### Option 3: Docker (Local/VPS)
```bash
git clone https://github.com/Tejeshreddyvajja/Invoice_generator.git
cd Invoice_generator
cp .env.example .env
# Edit .env with your values
npm run docker:compose:up
```

---

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (need 18+)
   - Ensure all dependencies are installed
   - Check for syntax errors in environment variables

2. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check network connectivity
   - Ensure database credentials are correct

3. **Frontend Not Loading**
   - Verify frontend build completed successfully
   - Check if static files are being served correctly
   - Ensure backend is running on correct port

4. **Email Not Working**
   - Verify SMTP credentials
   - Check if less secure app access is enabled (Gmail)
   - Ensure firewall allows SMTP traffic

### Getting Help

If you encounter issues:

1. Check the application logs
2. Verify all environment variables are set
3. Test database connectivity
4. Check the [Issues](https://github.com/Tejeshreddyvajja/Invoice_generator/issues) section
5. Create a new issue with detailed error information

---

## 🎉 Post-Deployment

After successful deployment:

1. **Test the Application**
   - Create a test account
   - Add sample customers and products
   - Generate a test invoice
   - Test PDF generation and email sending

2. **Set Up Monitoring**
   - Configure health check endpoints
   - Set up uptime monitoring
   - Configure error tracking

3. **Backup Strategy**
   - Set up automated database backups
   - Test backup restoration process
   - Document backup procedures

4. **Domain Setup** (Optional)
   - Configure custom domain
   - Set up SSL certificate
   - Configure DNS records

---

Made with ❤️ by Tejesh Reddy Vajja
