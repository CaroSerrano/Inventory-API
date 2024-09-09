import express from 'express';
import cors from 'cors';
import { resErrors } from '../src/utils/resErrors.js';
import morgan from 'morgan';
import helmet from 'helmet';
import apiRouter from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middlewares
app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Rutas
apiRouter(app);

// Manejo de errores con middlewares
app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  resErrors(res, statusCode, message);
});

// Levanta el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
