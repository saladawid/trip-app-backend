export interface NewTripEntity extends Omit<TripEntity, 'id'> {
    id?: string;
}

export interface TripEntity extends BasicTripEntity {
    name: string;
    description: string;
    price: number;
    url: string;
}

export interface BasicTripEntity {
    id: string;
    lat: number;
    lon: number;
}