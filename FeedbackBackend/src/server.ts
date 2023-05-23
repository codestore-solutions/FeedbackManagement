// creating the server 
import express from 'express';
const server =express();

// using cors
import cors from 'cors';

// importing morgan for logging
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'

// importing routes
import feedback_template_router from './routes/feedback_template_route';
import feedback_router from './routes/feedback_route';
import feedbackResponse_router from './routes/feedback_response_route';

//importing test routes
import user_routes from './routes/user_routes'
import client_routes from './routes/client_routes'
import product_routes from './routes/product_routes'

// importing the  db config 
import connect_db from './db/db-connect';

//importing swagger modules for documentation
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// using socketio
import { Server , Socket } from 'socket.io';
import io from './middlewares/notification/socketIOInstance'
import http from 'http';
const app = http.createServer(server);
io.attach(app);

// connect db function 
const start_server = async() => {

    try {

        await connect_db();
        server_config();

    } catch (error) {
        console.log("Error in connecting db")    
    }
}

// making access stream for morgan logger (for both access and error )
// const accessLogStream = fs.createWriteStream(path.join('logs', 'access.log'), { flags: 'a' });
// const errorLogStream = fs.createWriteStream(path.join('logs', 'error.log'), { flags: 'a' });

const server_config = () => {

    // using body parser
    server.use(express.json());

    // using cross origin resource sharing for all the routes
    // Access-Control-Allow-Origin: * i.e api accessed from any routes
    server.use(cors());
    
    // setting up morgan
    // server.use(morgan('combined', 
    //   {
    //     stream: accessLogStream,
    //     skip: (req:express.Request,res:express.Response)  => res.statusCode >= 400
    //   }));
      
    //   server.use(morgan('combined', 
    //   {
    //     stream: errorLogStream,
    //     skip: (req:express.Request,res:express.Response)  => res.statusCode <= 400
    //   }));
    
    // setting up routin middlewares
    server.use("/api/feedbackTemplate" , feedback_template_router);
    server.use("/api/feedback" , feedback_router);
    server.use("/api/response", feedbackResponse_router);

    // test routes
    server.use("/api/user", user_routes);
    server.use("/api/client" , client_routes);
    server.use("/api/product" , product_routes)

    app.listen(4000, () => {
        console.log("Server running at 4000");
    })
    
}

// start the server 
start_server();

// making swagger configurations
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Feedback Management Swagger UI",
      version: "0.1.0",
      description: "Feedback Management API ",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.ts" , "./src/documentation/*.yaml"],
};

const specs = swaggerJsdoc(options);
server.use(
  "/swagger", 
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);