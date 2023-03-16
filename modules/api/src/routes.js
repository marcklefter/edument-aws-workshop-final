const express   = require('express');
const axios     = require('axios').default;

const {
    SNSClient,
    PublishCommand
} = require('@aws-sdk/client-sns');

const env = require('./env');

// ...

const routes = express.Router();

const sns = new SNSClient({
    region: 'eu-north-1'
});

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
    const response 
        = await axios({
            method: 'POST',
            url: 'http://content/resources'
        });

    const request 
        = response.data;

    // ...
    
    await sns.send(new PublishCommand({
        Message: request.id,
        TopicArn: env.requestsTopic
    }));

    console.log('Content Request ID ' + request.id + ' published');

    // ...

    res.send(request);
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