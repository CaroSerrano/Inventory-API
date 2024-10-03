import express from 'express';
import cors from 'cors';
import { resErrors } from '../src/utils/resErrors.js';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import apiRouter from './routes/index.js';
import config from './config/config.js';

const dirname = import.meta.dirname
const app = express();
const PORT = config.PORT;

//Importación del motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(dirname, 'frontend/views'))

app.use('/static', express.static(path.join(dirname, 'frontend/public')));


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
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export {
  app,
  server
};