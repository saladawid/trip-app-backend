import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import {handleError, ValidationError} from './middleware/errors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());


app.use(handleError);


app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3000');
});