/** src/server.ts */
import http from 'http';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes/user';

dotenv.config();

const app: Express = express();

/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/** RULES OF OUR API */
app.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
app.use('/', routes);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Resource not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
export const httpServer = http.createServer(app);
const port: any = process.env.PORT ?? 6060;
httpServer.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));