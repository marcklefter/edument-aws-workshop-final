const express   = require('express');
const axios     = require('axios').default;

// ...

const routes = express.Router();

// ...
// TMS API.
routes.get('/status/:id', async (req, res) => {
    const response = await axios(`http://content/resources/${req.params.id}`);

    // ...

    const {
        status
    } = response.data;

    res.send({
        status
    });
});

routes.get('/content/:id', async (req, res) => {
    const response = await axios(`http://content/resources/${req.params.id}`);

    // ...

    res.send(response.data);
});

routes.post('/content', async (_, res) => {
    const response = await axios({
        method: 'POST',
        url: 'http://content/resources'
    });

    res.send(response.data);
});

routes.post('/injectfault', async (_, res) => {
    const response = await axios({
        method: 'POST',
        url: 'http://content/503'
    });

    res.send(response.data);
});

// ...

module.exports = routes;