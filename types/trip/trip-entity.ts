export interface NewTripEntity extends Omit<TripEntity, 'id'> {
    id?: string;
}

export interface TripEntity {
    id: string;
    name: string;
    description: string;
    price: number;
    url: string;
    lat: number;
    lon: number
}