import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { swaggerUi, specs } from './swagger.js';


import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import videoRoutes from './routes/video.routes.js'
import tareaRoutes from './routes/tarea.routes.js'

const app = express();


app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use('/api',videoRoutes)
app.use('/api', tareaRoutes)

export default app;