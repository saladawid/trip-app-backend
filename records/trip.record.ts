import {BasicTripEntity, NewTripEntity, TripEntity} from '../types';
import {ValidationError} from '../middleware/errors';
import {pool} from '../db/db';
import {FieldPacket} from 'mysql2';
import {v4 as uuid} from 'uuid';

type TripRecordResults = [TripEntity[], FieldPacket[]]

export class TripRecord implements TripEntity {
    public id: string;
    public name: string;
    public description: string;
    public price: number;
    public url: string;
    public lat: number;
    public lon: number;

    constructor(obj: NewTripEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('The name field is required');
        }
        if (obj.description.length > 1000) {
            throw new ValidationError('Maximum 1000 characters');
        }
        if (obj.price < 0) {
            throw new ValidationError('The price has to be greater than 0');
        }
        if (!obj.url) {
            throw new ValidationError('The url field is required');
        }
        if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
            throw new ValidationError('Wrong parameters of longitude and latitude');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.price = obj.price;
        this.url = obj.url;
        this.lat = obj.lat;
        this.lon = obj.lon;
    }

    static async getOne(id: string): Promise<TripRecord> | null {
        const [results] = await pool.execute('SELECT * FROM `trips` WHERE `id` = :id', {
            id,
        }) as TripRecordResults;

        return results.length === 0 ? null : new TripRecord(results[0]);
    }

    static async getAll(name: string): Promise<BasicTripEntity[]> {
        const [results] = await pool.execute('SELECT * FROM `trips` WHERE `name` LIKE :search', {
            search: `%${name}%`
        }) as TripRecordResults;

        return results.map(result => {
            const {id, lat, lon} = result;
            return {
                id, lat, lon
            };
        });
    }

    async insert(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert something that is already inserted!');
        }

        await pool.execute('INSERT INTO `trips`(`id`, `name`, `description`, `price`, `url`, `lat`, `lon`) VALUES(:id, :name, :description, :price, :url, :lat, :lon)', this);
    }

    static async deleteOne(id: string): Promise<void> {
        await pool.execute('DELETE FROM `trips` WHERE `id` = :id', {
            id,
        });
    }


}
