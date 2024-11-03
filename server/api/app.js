import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from '../routes/posts.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  optionsSuccessStatus: 200
};

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors(corsOptions));

app.use('/posts', postRoutes);

const CONNECTION_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fyhnx.mongodb.net/memories?retryWrites=true&w=majority&appName=Cluster0?directConnection=true`;

const connectDB = async () => {
  try {
    console.log('Initiating connection to the database...');
    await mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Database connection failed');
  }
};

mongoose.set('useFindAndModify', false);

const startServer = async (req, res) => {
  await connectDB();
  const PORT = process.env.PORT || 5000;

  // Express can be invoked directly with requests and responses
  app(req, res);
};

// Export the function for Vercel
export default startServer;
