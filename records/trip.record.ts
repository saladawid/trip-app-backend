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
    public arrival: string;
    public departure: string;
    public url: string;
    public lat: number;
    public lon: number;
    public id_user: string;

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
        if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
            throw new ValidationError('Wrong parameters of longitude and latitude');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.price = obj.price;
        this.arrival = obj.arrival;
        this.departure = obj.departure;
        this.url = obj.url;
        this.lat = obj.lat;
        this.lon = obj.lon;
        this.id_user = obj.id_user
    }

    static async getOne(id: string): Promise<TripRecord> | null {
        const [results] = await pool.execute('SELECT * FROM `trips` WHERE `id` = :id', {
            id,
        }) as TripRecordResults;

        return results.length === 0 ? null : new TripRecord(results[0]);
    }

    static async getAll(name: string, id_user: string): Promise<BasicTripEntity[]> {
        const [results] = await pool.execute('SELECT * FROM `trips` WHERE `name` LIKE :search AND `id_user` = :id_user', {
            search: `%${name}%`,
            id_user: id_user
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
        } else {
            throw new Error('Cannot insert something that is already inserted!');
        }
        this.id = uuid();

        await pool.execute('INSERT INTO `trips`(`id`, `name`, `description`, `price`, `arrival`, `departure`, `url`, `lat`, `lon`, `id_user`) VALUES(:id, :name, :description, :price, :arrival, :departure, :url, :lat, :lon, :id_user)', this);
    }

    static async deleteOne(id: string): Promise<string> {

        await pool.execute('DELETE FROM `trips` WHERE `id` = :id', {
            id,
        })
        return `The Trip by ID: has been deleted`
    }

    static async update(obj: TripEntity, id: string): Promise<TripRecord> {

        // await pool.execute('UPDATE `trips` SET `name` = ?, `description` = ?, `price` = ?, `arrival` = ?, `departure` = ?, `url` = ?, `lat` = ?, `lon` = ? WHERE `id` = ?', [
        //     obj.name, obj.description, obj.price, obj.arrival, obj.departure, obj.url, obj.lat, obj.lon, id]
        // );
        await pool.execute('UPDATE `trips` SET `name` = :name, `description` = :description, `price` = :price, `arrival` = :arrival, `departure` = :departure, `url` = :url, `lat` = :lat, `lon` = :lon WHERE `id` = :id', {
                name: obj.name,
                description: obj.description,
                price: obj.price,
                arrival: obj.arrival,
                departure: obj.departure,
                url: obj.url,
                lat: obj.lat,
                lon: obj.lon,
                id: id
            }
        );

        const [results] = await pool.execute('SELECT * FROM `trips` WHERE `id` = :id', {
            id,
        }) as TripRecordResults;

        return new TripRecord(results[0])
    }
}
