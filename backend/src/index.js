import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import 'dotenv/config';

// Database Connection Hook
import connectDB from './config/database.js';

// Routes Pipeline Assets
import productRoutes from './routes/productRoutes.js';
import cartsRoutes from './routes/cartRoutes.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orderRoutes.js'; 


await connectDB();

const app = express();

app.use(helmet());

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://glowbtechnologies.vercel.app',    
      'https://www.glowbtechnologies.vercel.app',
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL_WWW
    ].filter(Boolean);

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin pipeline:', origin);
      callback(new Error('Not allowed by CORS infrastructure'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running flawlessly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/products', productRoutes); 
app.use('/api/contact', contactRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/orders', orderRoutes); 

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route matrix mismatch on path: ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Infrastructure Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`System Online in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection Node Crash: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

export default app;