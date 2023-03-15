const crypto    = require('crypto');
const express   = require('express');

// ...

const routes = express.Router();

// ...
// Resource store.
const resources = {};

const makeResponse = id => ({
    id,
    ...resources[id]
});

// ...

routes.get('/resources/:id', (req, res) => {
    console.log('tms-content: Fetching content resource.');
    
    res.send(makeResponse(req.params.id));
});

routes.put('/resources/:id', (req, res) => {
    console.log('tms-content: Updating content resource.');

    const id = req.params.id;

    // ...

    resources[id] = {
        ...resources[id],
        ...req.body
    };

    // ...

    res.send(makeResponse(id));
});

routes.post('/resources', (_, res) => {
    console.log('tms-content: Creating content resource.');

    // ...

    const resourceId    = crypto.randomUUID();
    const resource      = {
        status: 'created'
    };

    resources[resourceId] = resource;

    // ...

    res.status(201).send(makeResponse(resourceId));
});

// ...

module.exports = routes;