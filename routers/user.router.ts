import {UserRecord} from '../records/user.record';
import {Router} from 'express';
import {ValidationError} from "../middleware/errors";

export const userRouter = Router()

    .post('/login', async (req, res) => {
        const user = await UserRecord.login(req.body.email, req.body.password);

        res.json(user);

    })

    .post('/', async (req, res) => {

        const result = await UserRecord.getOne(req.body.email);
        if (result === null) {
            throw new ValidationError('Email is registered')
        }
        const user = new UserRecord(req.body);
        await user.register();
        res.json(user);

    })

    .get('/', async (req, res) => {

        const users = await UserRecord.getAll();

        res.json(users);
    })

    .get('/:id', async (req, res) => {

        const user = await UserRecord.getOne(req.params.id);

        res.json(user);
    })

    .post('/', async (req, res) => {


        const user = new UserRecord(req.body);

        await user.register();

        res.json(user);
    })

    .put('/:id', async (req, res) => {

        const user = await UserRecord.update(req.body, req.params.id);

        res.json(user)

    })

    .delete('/:id', async (req, res) => {

        await UserRecord.deleteOne(req.params.id);

        res.json('delete');
    });