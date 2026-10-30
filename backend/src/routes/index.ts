import { Router } from 'express';
import healthRoutes from './healthRoutes';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import propertyRoutes from './propertyRoutes';
import buyerRequirementRoutes from './buyerRequirementRoutes';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/properties', propertyRoutes);
apiRouter.use('/buyer-requirements', buyerRequirementRoutes);

export default apiRouter;


