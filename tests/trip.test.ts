import {TripRecord} from '../records/trip.record';
import {TripEntity} from '../types';

test('TripRecord returns data from database for one entry.', async () => {

    const trip = await TripRecord.getOne('abc')

    expect(trip).toBeDefined()
    expect(trip.id).toBe('abc')
    expect(trip.name).toBe('Test')
    expect(trip.description).toBe('Testowy')
});

test('TripRecord.getOne returns null from database for nonexistent entry.', async () => {

    const trip = await TripRecord.getOne('---')

    expect(trip).toBeNull()
});

test('TripRecord.getAll returns array of found entries.', async () => {

    const trips = await TripRecord.getAll('')

    expect(trips).not.toEqual([]);
    expect(trips[0].id).toBeDefined();
});

test('TripRecord.getAll returns empty array when searching something that does not exist.', async () => {

    const trip = await TripRecord.getAll('---')

    expect(trip).toEqual([])
});

test('TripRecord.getAll returns basic data.', async () => {

    const trip = await TripRecord.getAll('');

    expect((trip[0] as TripEntity).price).toBeUndefined();
    expect((trip[0] as TripEntity).description).toBeUndefined();
});

