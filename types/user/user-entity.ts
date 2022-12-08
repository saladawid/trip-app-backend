export interface UserEntity {
    id: string;
    name?: string;
    email: string;
    password?: string;
}

export interface LoggedUserEntity extends Omit<UserEntity, 'password'> {
    token: string;
}

declare global {
    namespace Express {
        interface Request {
            user: string;
        }
    }
}