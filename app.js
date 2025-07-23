import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import playerRoutes from './routes/players.routes.js';
import subscriptionRoutes from './routes/subscriptions.routes.js';
import uniformRoutes from './routes/uniforms.routes.js';
import registrationRoutes from './routes/registrations.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/uniforms', uniformRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
