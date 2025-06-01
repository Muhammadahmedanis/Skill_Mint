import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './db/index.js';

dotenv.config({ path: './.env' });

// Export a promise that resolves with `app` for Vercel
const startServer = async () => {
  await connectDB();
  return app;
};

export default await startServer();
