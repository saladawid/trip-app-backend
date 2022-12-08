import {TripRecord} from '../records/trip.record';
import {Router} from 'express';

export const tripRouter = Router()

    .get('/search/:name?', async (req, res) => {

        const trips = await TripRecord.getAll(req.params.name ?? '', req.user);

        res.json(trips);
    })

    .get('/:id', async (req, res) => {

        const trip = await TripRecord.getOne(req.params.id);

        res.json(trip);
    })

    .post('/', async (req, res) => {

        req.body.id_user = req.user

        const trip = new TripRecord(req.body);
        await trip.insert();

        res.json(trip);
    })

    .put('/:id', async (req, res) => {

        const trip = await TripRecord.update(req.body, req.params.id);

        res.json(trip)

    })

    .delete('/:id', async (req, res) => {

        await TripRecord.deleteOne(req.params.id);

        res.json('delete');
    });