const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const uri = 'mongodb+srv://guest:guestPasword1@cluster0.2jjlgml.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect();
const database = client.db('mydb');
const events = database.collection('events');

const notify = (event) => {
    console.log(`Notifying:`);
    event.participants.forEach(p => console.log(p.name))
}

app.use(express.json());

app.post('/events', async (req, res) => {
    try {
        if (req.body.date < new Date()) {
            res.status(400).send('Cannot create event in the past');
        }
        if (req.body.duration < 0) {
            res.status(400).send('Cannot create event with negative duration');
        }
        if (req.body.participants.length >= 10) {
            res.status(400).send('Cannot add more than 10 participants');
        }
        let event;
        try {
            event = {
                ...req.body,
            };
        } catch (err) {
            console.error(err);
            res.status(400).send('Invalid payload');
        }
        const result = await events.insertOne(event);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.get('/events', async (req, res) => {
    try {
        const result = await events.find().toArray();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.get('/events/:id', async (req, res) => {
    try {
        const result = await events.findOne({ _id: new ObjectId(req.params.id) });
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.post('/events/addParticipant', async (req, res) => {
    try {
        const eventId = new ObjectId(req.body.eventId);
        const participant = {
            id: new ObjectId(),
            ...req.body.participant
        }

        const event = await events.findOne({ _id: eventId });
        if (!event) {
            res.status(404).send('Event not found');
            return;
        }
        notify(event);
        if (event.participants.length >= 10) {
            event.waitingList.push(participant);
            await events.updateOne({ _id: eventId }, { $set: event });
            res.status(200).send('Cannot add more than 10 participants, added to the waiting list');
            return;
        }

        if (event.participants.find(p => p.name === participant.name)) {
            res.status(400).send('Cannot add participant twice');
            return;
        }

        event.participants.push(participant);
        const result = await events.updateOne({ _id: eventId }, { $set: event });
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.post('/event/removeParticipant', async (req, res) => {
    try {
        const eventId = new ObjectId(req.body.eventId);
        const participantName = req.body.name;

        const event = await events.findOne({ _id: eventId });
        if (!event) {
            res.status(404).send('Event not found');
            return;
        }
        notify(event);
        event.participants = event.participants.filter(p => p.name !== participantName);
        event.participants.push(event.waitingList.shift());
        const result = await events.updateOne({ _id: eventId }, { $set: event });
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.delete('/events/:id', async (req, res) => {
    try {
        const result = await events.deleteOne({ _id: new ObjectId(req.params.id) });
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
