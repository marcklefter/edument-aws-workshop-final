const { 
  SQSClient, 
  DeleteMessageCommand,
  ReceiveMessageCommand 
} = require("@aws-sdk/client-sqs");

const env = require('./env');

// ...

const client = new SQSClient({ region: "eu-north-1" });

// ...

let running = true;

const stopRunning = () => {
  console.log('Exiting polling loop');

  running = false;
}

process.on('SIGINT', stopRunning);
process.on('SIGTERM', stopRunning);

// ...

const processor = async () => {
  while (running) {
    const out = await client.send(new ReceiveMessageCommand({
      QueueUrl: env.queueUrl,
      WaitTimeSeconds: 15
    }));    
    
    if (!running) {
      console.log('Processor shutting down...');
      break;
    }

    if (out.Messages === undefined || out.Messages.length === 0) {
      // note: continue instead of return! 
      continue;
    }

    for (const message of out.Messages) {
      const {
        Body,
        ReceiptHandle
      } = message;

      const body      = JSON.parse(Body);
      const requestId = body.Message;

      // ...
      // Process message by updating the request status.
      console.log('Processing request with ID: ' + requestId);

      // TBD: Invoke TMS Content service to update request's status (= "pending").

      // ...
      
      await client.send(new DeleteMessageCommand({
        QueueUrl: env.queueUrl,
        ReceiptHandle
      }));
    } 
  }
}

processor();