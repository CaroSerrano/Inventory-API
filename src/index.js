import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { resErrors } from '../src/utils/resErrors.js';
import morgan from 'morgan';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import path from 'path';
import apiRouter from './routes/index.js';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);
const app = express();
const PORT = config.PORT;

//Importing of template engine
app.set('view engine', 'pug');
app.set('views', path.join(dirname, 'frontend/views'))

app.use('/static', express.static(path.join(dirname, 'frontend/public')));


// middlewares configuration
app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
// Routes
apiRouter(app);

// Error handling with middlewares
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  resErrors(res, statusCode, message);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export {
  app,
  server
};