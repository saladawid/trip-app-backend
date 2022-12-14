import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import {handleError} from './middleware/errors';
import rateLimit from 'express-rate-limit';
import {tripRouter} from './routers/trip.router';
import {userRouter} from "./routers/user.router";
import {protect} from "./middleware/auth";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
}));

app.use('/api/trip', protect, tripRouter);
app.use('/api/user', userRouter);


app.use(handleError);


app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});