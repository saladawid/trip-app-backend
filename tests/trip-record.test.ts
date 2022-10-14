import {TripRecord} from '../records/trip.record';

const defObjTrip = {
    name: 'Test',
    description: 'Testowy',
    price: 0,
    lat: 0,
    lon: 0,
    url: 'zosia',
}


test('Can build TripRecord', () => {

    const trip = new TripRecord((defObjTrip));

    expect(trip.name).toBe('Test');
    expect(trip.description).toBe('Testowy')
});

test('Validates invalid price', () => {

    expect(() => new TripRecord({
        ...defObjTrip,
        price: -1
    })).toThrow('The price has to be greater than 0')

});