import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { PORT } from './config/server-config';
import logger from './utils/logger';
import apiRoutes from './routes/index';


const app=express();
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRoutes);


const setup_and_start_server=()=>{
    app.listen(PORT,()=>{
        logger.info(`Server is running on port ${PORT}`);
    })
    
}
setup_and_start_server();

const handleServerShutdown=async ()=>{
    try {
        logger.info("Shutting down server...");
        logger.info("Server shutdown complete.");
        process.exit(0);
    } catch (error) {
        logger.error("Error during server shutdown:", error);
        process.exit(1);
    }
}

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);