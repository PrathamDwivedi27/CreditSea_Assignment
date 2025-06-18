import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


const app=express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


import { PORT } from './config/server-config';


const setup_and_start_server=()=>{
    app.listen(PORT,()=>{
        
    })
    
}