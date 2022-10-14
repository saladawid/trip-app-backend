import {TripEntity} from '../types';
import {ValidationError} from '../middleware/errors';

interface newTripEntity extends Omit<TripEntity, 'id'> {
    id?: string;
}

export class TripRecord implements TripEntity {
    public id: number;
    public name: string;
    public description: string;
    public price: number;
    public url: string;
    public lat: number;
    public lon: number;

    constructor(obj: newTripEntity) {
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

        this.name = obj.name;
        this.description = obj.description;
        this.price = obj.price;
        this.url = obj.name;
        this.lat = obj.lat;
        this.lon = obj.lon;

    }
}