import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import customerRoutes from './routes/customerRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { closePool } from './config/database.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/customers', customerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/v1/customers`);
});

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('HTTP server closed');

    try {
      await closePool();
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
