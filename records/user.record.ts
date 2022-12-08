import {LoggedUserEntity, UserEntity} from '../types';
import {ValidationError} from '../middleware/errors';
import {pool} from '../db/db';
import {FieldPacket} from 'mysql2';
import {v4 as uuid} from 'uuid';
import {encrypt} from "../utils/encrypt";
import {decrypt} from "../utils/decrypt";
import {generateToken} from "../utils/generteToken";

type UserRecordResults = [UserEntity[], FieldPacket[]]

export class UserRecord implements UserEntity {
    public id;
    public name;
    public email;
    public password;

    constructor(obj: UserEntity) {
        if (!obj.email) {
            throw new ValidationError('The email field is required');
        }
        if (!obj.password) {
            throw new ValidationError('The password field is required');
        }

        this.id = uuid();
        this.name = obj.name;
        this.email = obj.email;
        this.password = obj.password

    }

    static async getOne(id: string): Promise<UserEntity[]> | null {
        const [user] = await pool.execute('SELECT * FROM `users` WHERE `id` = :id', {
            id,
        }) as UserRecordResults;

        return user.length === 0 ? null : user.map(result => {
            const {id, name, email} = result;
            return {
                id,
                name,
                email,
            }
        })
    }

    static async getAll(): Promise<UserEntity[]> {
        const [results] = await pool.execute('SELECT * FROM `users`') as UserRecordResults;

        return results
    }

    async register(): Promise<void> {
        await pool.execute('INSERT INTO `users`(`id`, `name`, `email`, `password`) VALUES(:id, :name, :email, :password)', {
            id: this.id,
            name: this.name,
            email: this.email,
            password: await encrypt(this.password)
        })
    }

    static async login(email: string, password: string): Promise<LoggedUserEntity[]> | null {

        const [user] = await pool.execute('SELECT * FROM `users` WHERE `email` = :email', {
            email,
        }) as UserRecordResults;

        if (user.length === 0) {
            throw new ValidationError('Invalid email or password')
        }

        const matchPassword = await decrypt(password, user[0].password)

        if (matchPassword) {
            return user.map(result => {
                const {id, name, email} = result;
                return {
                    id,
                    name,
                    email,
                    token: generateToken(id)
                }
            });
        } else {
            throw new ValidationError('Invalid email or password')
        }
    }

    static async deleteOne(id: string): Promise<string> {
        await pool.execute('DELETE FROM `users` WHERE `id` = :id', {
            id,
        })
        return `User removed`
    }

    static async update(obj: UserEntity, id: string): Promise<UserRecord> {

        await pool.execute('UPDATE `users` SET `name` = :name, `email` = :email, `password` = :password WHERE `id` = :id', {
                name: obj.name,
                email: obj.email,
                password: obj.password,
                id: id
            }
        );

        const [results] = await pool.execute('SELECT * FROM `users` WHERE `id` = :id', {
            id,
        }) as UserRecordResults;

        return new UserRecord(results[0])
    }

}
