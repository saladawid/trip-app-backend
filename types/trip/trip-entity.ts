export interface NewTripEntity extends Omit<TripEntity, 'id'> {
    id?: string;
}

export interface TripEntity extends BasicTripEntity {
    name: string;
    description: string;
    price: number;
    url: string;
    arrival: string;
    departure: string;
    id_user: string
}

export interface BasicTripEntity {
    id: string;
    lat: number;
    lon: number;
}