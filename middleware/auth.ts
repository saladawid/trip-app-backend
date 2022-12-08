import jwt from 'jsonwebtoken';
import {ValidationError} from "./errors";
import {UserRecord} from "../records/user.record";

interface Payload {
    id: string
}

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, 'SECRET') as Payload;
            const user = await UserRecord.getOne(decodedToken.id)
            req.user = user[0].id
            next();
        } catch (error) {
            res.status(401);
            throw new ValidationError('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new ValidationError('Not authorized, no token');
    }
};
