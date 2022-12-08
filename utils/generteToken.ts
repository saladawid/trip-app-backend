import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
    return jwt.sign({id}, 'SECRET', {
        expiresIn: '1d',
    });
};
