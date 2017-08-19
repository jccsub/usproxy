# Notes on: How to CQRS in Node: Eventually Consistent, Unidirectional Systems with Microservices

Video found here: [youtube](https://www.youtube.com/watch?v=4k7bLtqXb8c)


## Introduction to CQRS

* Command-Query Responsibility Segregation
A system-wide architecture that states - externally facing subsystems (apps and apis) send commands to perform actions which update the system's state and request queries to dtermine system's state. (Basically CQS on a system-wide scale. Calls between services should change stuff, or get stuff. never both)

* Your apps and apis should get information from one location and update (by sending commands) to another location. So your commands and queries are coming and going to different places. No longer are we updating and asking for state from a single databse.

* In this scenario, the web-app, when sending a command, does not go directly to the database server, but to a svc. (eg. "order service, create an order", we're saying, "update your state")

* The svc that the web app communicates with are the micro services.

* The micro svcs have their own little databases in which it writes its updates to. In its database it has only the tables that it updates.

* The svc will emit an event when it is done processing the command.

* A denormalizer component listens to the events emitted by the micro services. It's sort of an abstract (not real well defined) piece of software that takes the svc db and writes it to the denormalizer db in a denormalized way that is optimized for the UI.

* There are small windows of time where the svcs database will not be the same as the denormalizer db, but we've decided that that will be ok. This is called "eventually consistent".

* CQRS uses a **choreography** model instead of an **orchestration** model. 
  * In a distributed system, if you have a broker in the middle whose job it is to handle the workflow and to tell services one step at a time, svc do this, wait for a response, then next service do this, wait for a response, then you have a orchestration model.
  * The main problems with an orchestration model are:
    * You have a single point of failure.
    * You have a single point of scalability that causes issues when you grow.
  * CQRS uses a choreography model which says, the decider of where the events get published is within every single service. 


## Commands in CQRS

[Commands in CQRS](https://youtu.be/4k7bLtqXb8c?t=872)

### Commands
Commands tell services when an actor wants an action

* Clients send commands to instruct a service to do work
* Commands are sent directly to a single receivng service
* Commands are sent asynchronously; fire and forget
* Commands are present-tense, directives: order.create

### Events
Events tell the world when you're done

* Services publish to inform other services of work/actions performed, and state updated
* Services publish (broadcast) events to any services that wish to subscribe
* Events are past-tense, describe what happened: order.created.


## Two Types of Services

### Front end services

![frontend](file:///C:/Users/chadc/Documents/git-projects/usproxy/how.to.cqrs.in.node.res/FrontEnd.png)

Front end services are user facing or customer facing (like when 3rd party vendor ) So, they can be:
* A web app that's feeding some javascript UI. 
* A web api that's feeding some mobile app.
* Or they can be some sort of third party gateway to one of your client providers.

#### So How does this work?
1. We read from the database
1. Instead of writing back to the database we send some command to some outside service. (We will be using servicebus for node which runs on RabbitMQ)

The code will look something like this:

```javascript
//web-app, onButtonClick. instead of updating db.
const bus = require('servicebus').bus();

bus.send('order.create',{
  order: {
    userId: userId,
    ordierItems: items
  }
});
```

* With servicebus you can either send a message to one service or broadcast. Here, we are only going to be se4nding to one service.
* RabbitMQ provides **reliable** services. By reliable, we mean that the queues persist as well as the messages. So the service could go down, but the queue would and the messages in the queue would remain.

#### What do we do after we call the service?

We are either coding a reactive/realtime or a non-realtime system. 
* If reactive or realtime, then we wait for polling to detect changes (or use one of the various methods implemented by the db server that we are using)
* If non-realtime (which is what I'm considering right now), just send back `thanks! we're processing your order! check back later for updates!`

### Back end services

![backend](file:///C:/Users/chadc/Documents/git-projects/usproxy/how.to.cqrs.in.node.res/BackEnd.png)

The back end services perform the following operations:

* Listen for commands and subscribe to events
* Performs business logic to process commands and events
* Update local state (optionally)
* Publish events to tell external services of updated state

The following is simplistic code for a back end service:

```javascript
//order-svc index.js
const bus = require('./bus');
const create = require('./lib/create');

bus.listen('order.create',(event)=> {
  create(event, (err,order) => {
    if (err) return event.handle.reject();
    bus.publish('order.created',order,() => {
      event.handle.ack();
    })
  })
})
```
#### What about downstream services?
The operations performed by downstream services are exactly the same as the ones performed by the backend service:

* Listen for commands and subscribe to events
* Performs business logic to process commands and events
* Update local state (optionally)
* Publish events to tell external services of updated state

It looks like this:

![downstream](file:///C:/Users/chadc/Documents/git-projects/usproxy/how.to.cqrs.in.node.res/downstream.png)

The downstream code looks very similar to that of the backend service code with the exception that it subscribes for events instead of listening for commands:

```javascript
//fulfillment-svc index.js
const bus = require('.bus');
const fulfill = require('./lib/fulfill');

bus.subscribe('order.created',(event) => {
  fulfill(event, (err,order) => {
    if (err) return event.handle.reject();
    bus.publish('order.fulfilled', order, () => {
      event.handle.ack();
    })
  })
})
```
#### File/Folder organization

This is the convention based event handler defintion for distributed services using servicebus:

![fileorg](file:///C:/Users/chadc/Documents/git-projects/usproxy/how.to.cqrs.in.node.res/fileorg.png)

##### What might the index.js file look like?

```javascript

const bus = require('./lib/bus'); //instantiate servicebus instance
const config = require('cconfig')();
const log = require('llog');
const registerHandlers = require('servicebus-register-handlers');

registerHandlers({
  bus: bus,
  handleError: function handleError(msg,err) {
    log.error('error handling %s: %s. rejecting message w/ cid %s and correlationId %s.', msg.type, err, msg.cid, this.correlationId);
    log.error(err);
    msg.handle.reject(function() {
      throw err;
    });
  },
  path: './lib/handlers',
  queuePrefix: 'my-svc-name'
})

```

##### What does a handler file look like?

Each handler is a file. The file will look sort of like this:

```javascript
const log = require('llog');

module.exports.ack = true;

module.exports.queueName = 'my-service-name-order';
module.exports.routingKey = 'order.create';
module.exports.listen = function(event,cb) {
  log.info('handling listened event of type ${event.type} with routingKye ${this.routingKey}');

  /* 
  do something with your event
  */
  cb(); //<---- no params marks success. pass back error to retry or fail. callback based transactions
};
```

* So, from above, you see that you will implement either a `listen` or a `subscribe`
* You tell it what routingKey to use
  * If you use a listen with a routingKey, that means that you are listening for that command ('order.create')

#### ServiceBus Middleware

Here's an example of using ServiceBus middleware:

```javascript
// ./lib/bus.js required as single bus instance used anywhere in service
const config = require('cconfig')();
const servicebus = require('servicebus');
const retry = require('servicebus-retry');
const trace = require('servicebus-trace');

const bus = servicebus.bus({
  url:config.RABBITMQ_URL
});

/*
bus.package() packages outgoing message data and adds useful type, timestanp, and other properties.
*/
bus.use(bus.package());
/*
bus.correlate() adds a correlationId for tracing related commands and events through your system
*/
bus.use(bus.correlate());
/*
retry middleware causes every failed message to be retried 3 times. after that
the message will automatically be put on an error queue for human inspection.
*/
bus.use(retry({
  store: new retry.RedisStore({
    host: config.REDIS.HOST,
    port: config.REDIS.PORT
  })
}));

/*
trace will display service middleware trace information from your local redis instance.
*/
bus.use(trace({
  serviceName: 'my-service-name',
  store: new trace.RedisStore({
    host: config.REDIS_HOST || 'localhost',
    port: config.REDIS_PORT || 6379
  })
}));

module.exports = bus;

```

#### Ok, what is the denormalizer?
* The denormalizer is just another backend service.
* Has one job to do
* Subscribe to allevents that the UI cares about
* Persist events in a format most efficient for the UI to view
* Completes the eventually consistent, unidirectional flow.

A denormalizer ends up looking like this:

![denormalizer](file:///C:/Users/chadc/Documents/git-projects/usproxy/how.to.cqrs.in.node.res/denormalizer.png)

## Useful Links

* [microsvc](https://github.com/mateodelnorte/microsvc) : a tiny reusable framework for building microservices with messaging and rest

