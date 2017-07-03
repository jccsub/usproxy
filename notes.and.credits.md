# bookm Notes and Credits

<!-- TOC -->

- [bookm Notes and Credits](#bookm-notes-and-credits)
  - [General Notes](#general-notes)
  - [Conventions Used](#conventions-used)
    - [Use exact versions for dependencies](#use-exact-versions-for-dependencies)
    - [Lowercase file names](#lowercase-file-names)
    - [General Coding Conventions](#general-coding-conventions)
    - [Define interfaces for callbacks](#define-interfaces-for-callbacks)
    - [Node project organization](#node-project-organization)
    - [Event handlers in TypeScript](#event-handlers-in-typescript)
      - [TypeScript EventHandler Property](#typescript-eventhandler-property)
      - [Node.js EventEmitter with Custom Events](#nodejs-eventemitter-with-custom-events)
  - [Dependencies](#dependencies)
    - [Using Winston logger](#using-winston-logger)
    - [Using gulp as build tool](#using-gulp-as-build-tool)
    - [Using mssql for SQL Server Access](#using-mssql-for-sql-server-access)
    - [Using Express](#using-express)
    - [Using Typescript](#using-typescript)
    - [Using TypeORM](#using-typeorm)
    - [Using Mocha for test support](#using-mocha-for-test-support)
    - [Using mocha-typescript to write tests in typescript](#using-mocha-typescript-to-write-tests-in-typescript)
    - [Using TypeMoq for unit test mocks](#using-typemoq-for-unit-test-mocks)
    - [Code Coverage with Istanbul](#code-coverage-with-istanbul)
    - [Required Node Version](#required-node-version)
    - [Proxy Server](#proxy-server)
  - [Notes on Node Subjects](#notes-on-node-subjects)
    - [Summary](#summary)
    - [Streams](#streams)
    - [Notes on Http.ServerResponse](#notes-on-httpserverresponse)
    - [Introduction to Http-Proxy](#introduction-to-http-proxy)
    - [Notes on Http.ClientRequest](#notes-on-httpclientrequest)
    - [Notes on The Node Request Module](#notes-on-the-node-request-module)
    - [Notes on Node's Http server](#notes-on-nodes-http-server)
    - [Notes on Listening to Http-Proxy Traffic](#notes-on-listening-to-http-proxy-traffic)
  - [Additional Helpful Links](#additional-helpful-links)
    - [Continuation-Local-Storage](#continuation-local-storage)
    - [Method overloading](#method-overloading)
    - [Debugging ES6 in VS Code](#debugging-es6-in-vs-code)
    - [Debugging Mocha Tests](#debugging-mocha-tests)
    - [A proxy server in 20 lines](#a-proxy-server-in-20-lines)
    - [Best Practices for Node.js Development](#best-practices-for-nodejs-development)
    - [Typescript Mixins](#typescript-mixins)
    - [Proper error handling in Node](#proper-error-handling-in-node)
    - [Converting local file paths to urls](#converting-local-file-paths-to-urls)

<!-- /TOC -->

## General Notes

* I think Box corrupts my node_modules folder. Moving to non-box location and just using git.

* I'm excluding the capability to add middleware to the proxy server intentionally. The middleware that is internally used by the proxy server remains internal and is passed in through the constructor. The reason is that middleware makes the proxy server too flexible and may lead to my confusion since this is being written bit-by-bit over a long period of time. 

Extensibility is tightly controlled and strongly typed so that I don't have to remember what my intention was. Intention is evident and enforced.

## Conventions Used

### Use exact versions for dependencies 

The following two commands make changes to the [.npmrc](file:///C:/Users/chadc/.npmrc) file

* Save installed packages to a package.json file as dependencies.
    
        npm config set save=true

* Save dependencies with an exact version
    
        npm config set save-exact=true

### Lowercase file names

### General Coding Conventions

Microsoft's TypeScript [Coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines) was loosely followed

### Define interfaces for callbacks
* I was defining function/callback signatures inline before reading [this post](https://www.bennadel.com/blog/3217-defining-function-and-callback-interfaces-in-typescript.htm).
* I'm now explicitly defining interfaces for callbacks so that the code will be more readable.

### Node project organization

I'm kind of using [this](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/) as a guideline.

### Event handlers in TypeScript

#### TypeScript EventHandler Property

* Not sure if I'm ok with this form of event handling yet, but thought I would reference it
* Link: [TypeScript Event Property](http://stackoverflow.com/a/33577618)

#### Node.js EventEmitter with Custom Events

* I like this better, however, I might opt for the previous since it seems to be more in line with the goals of typescript
* Link: [Node.js EventEmitter](http://www.tutorialsteacher.com/nodejs/nodejs-eventemitter)


## Dependencies

### Using Winston logger

I chose Winston based on the community support and ease of use. Had considered, morgan and bunyan, as well.

### Using gulp as build tool

There seems to be a move away from grunt and gulp and a move towards using npm scripts for several reasons. I had planned to do the same, but will hold off, as there are some good arguments against such a change and I'm more familiar with the gulp way of things. Not adverse to going back to change later though.

### Using mssql for SQL Server Access

* Here's a little test I did to see it work:

```javascript
  async trythis() {
    let pool = await sql.connect(this.config);
    let result1 = await pool.request().query('select * from test');
    return result1;
  }

  @test
  Test() {
    this.log.debug('about to start');
    this.trythis().then((result) => console.dir(result));
  }
```

and here's the output:

```javascript
{ recordsets: [ [ [Object], [Object] ] ],
  recordset:
   [ { id: 1,
       name: 'name1     ',
       value: 'value1
                                                                      ' },
     { id: 2,
       name: 'name2     ',
       value: 'value2
                                                                      ' } ],
  output: {},
  rowsAffected: [ 2 ] }
```

### Using Express
* Instead of Koa(2)
* Will probably go back and replace express later. But for now, just to keep things moving...

### Using Typescript
The following was a quick intro into using typescript with node:
* [Developing a restful api with node and typescript](http://mherman.org/blog/2016/11/05/developing-a-restful-api-with-node-and-typescript/#.WOOdm28rLmg)

### Using TypeORM

I started off with the plan of just mixing in my sql into my reader/writer classes. I really didn't want to use or implement an orm, but keeping the sql spread out in different node classes was not pleasant either and without realizing it, as I began to refactor my code I ended up implementing much of an orm that continued to grow so quickly that it was in danger of becoming the most significant component of the application. I abandoned the sql related classes that I had written for TypeORM. It looks like one of the more successful (and simple) node orms out there.


### Using Mocha for test support

A typical test configuration in package.json will look like this:

```javascript
"scripts": {
  "start": "node dist/index.js",
  "test": "mocha --reporter spec --compilers ts:ts-node/register 'test/**/*.test.ts'"
},
```

The path pattern will not work in windows. The above in windows should be something like:

```javascript
  "scripts": {
    "test": "mocha --recursive --reporter spec --compilers ts:ts-node/register \".\\test\\*.ts\"",
    "start": "node dist/index.js"
  },
```
* The above "test" pattern is working.

* Look [here](http://brianflove.com/2016/11/11/typescript-2-express-mongoose-mocha-chai/) for an example of using Mocha with Typescript (Search for text "Updated 2016-11-28")

### Using mocha-typescript to write tests in typescript

The only headache with this module so far has been with async tests. Fortunately, the module takes into consideration and provides a few ways of dealing with it. See the mocha-typescript npm page for more info on async. Here's an example:

```javascript
@test
  async executingASelectThatReturnsMoreThanOneRowIsSuccessful() {
    await this.dataConnection.execute('select * from master..sysdatabases').then((result) => {
      return new Promise((resolve,reject) => {
        try {
          expect(result.recordset.length).to.be.greaterThan(1);
        }
        catch(err) {
          reject(err);
        }
        resolve();
      });
    });
  }
```

### Using TypeMoq for unit test mocks

[Github site](https://github.com/florinn/typemoq)

### Code Coverage with Istanbul

The first paragraph of the [istanbul.js.org's](https://istanbul.js.org) post, [Using Istanbul With Mocha](https://istanbul.js.org/docs/tutorials/mocha/), is what I stumbled across after searching for about 2 hours on how to use Istanbul with mocha on Windows.

>*At the end of the day, all you need to do is place the bin nyc in front of the existing test scripts in your package.json*

Incredibly enough, all I had to do was install [nyc](https://github.com/istanbuljs/nyc) and then change:

    npm test
    
  to

    nyc npm test

and I got output like this (truncated a bit):

File                         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------------------|----------|----------|----------|----------|----------------|
All files                    |     56.7 |    41.67 |    40.63 |    57.07 |                |
 src/proxy                   |     47.2 |    33.33 |     32.5 |    47.97 |                |
  data-map.ts                |       50 |      100 |        0 |       50 |              5 |
  proxy-context.ts           |    33.33 |        0 |       50 |    33.33 |... 28,29,30,31 |
  proxy-listener.ts          |    33.33 |      100 |        0 |    33.33 |      7,8,17,18 |
 src/proxy/test              |    75.44 |       50 |    56.25 |       78 |                |
  errorhandling-test.ts      |    72.34 |      100 |       50 |       75 |... 65,66,67,68 |
  mock-proxyevent-emitter.ts |       90 |       50 |       75 |       90 |             23 |

    

### Required Node Version

* Currently using 7.90

| Package | Required Node Version |                                    Notes                                    |
| :-----: | :-------------------: | :-------------------------------------------------------------------------- |
|  Koa2   |         7.60          | Have decided to start with express instead of Koa for now. May switch later |


### Proxy Server
I considered starting with a blank slate like [this](http://www.catonmat.net/http-proxy-in-nodejs/), however, I would have consumed much of my time just trouble-shooting proxy code, which that isn't my aim here.

## Notes on Node Subjects

### Summary

###  Streams
 [Node.js v7.9.0 Documentation](https://nodejs.org/api/stream.html) 


### Notes on Http.ServerResponse
Notes from [How to read from a writable stream (http.ServerResponse) in Node](http://www.acuriousanimal.com/2015/08/31/how-to-read-from-a-writable-stream-httpserverresponse-in-node.html) and [Node.js HTTP Server Response Class](http://www.apetuts.com/tutorial/node-js-http-server-response-class/)

### Introduction to Http-Proxy
Notes from [Proxying HTTP and Websockets in Node](https://blog.nodejitsu.com/http-proxy-intro/)

### Notes on Http.ClientRequest
Notes from [Node.js HTTP Client Request Class](http://www.apetuts.com/tutorial/node-js-http-client-request-class/)

### Notes on The Node Request Module
Notes from [Node Hero - Node.js Request Module Tutorial](https://blog.risingstack.com/node-hero-node-js-request-module-tutorial/)

### Notes on Node's Http server
Notes from [Node.js : HTTP server](http://www.w3resource.com/node.js/nodejs-http-server.php)

### Notes on Listening to Http-Proxy Traffic
Notes from this [stackoverflow answer](http://stackoverflow.com/a/32186243)


## Additional Helpful Links

### Continuation-Local-Storage
Sort of like thread-local-storage in Windows. In my case, Harmon allows me to provide a callback that looks something like this:

```javascript
(element) => {
  ...do stuff to the html element
}
```

The callback is setup during the initialization process. You get one-shot to provide the What I want to do is to provide a way that I can dynamically add other callbacks that are called in a sequence during the '...do stuff to the html element' and to provide context (request, response, etc.) so that the callbacks can make decisions as to what to replace and what to keep. In that case, the call back above will have to have access to at least the request object.

This [stackoverflow](http://stackoverflow.com/a/29073047) post explains exactly how to do that. 

### Method overloading
See [StackOverflow post](http://stackoverflow.com/a/12689054)

### Debugging ES6 in VS Code

* Struggled with this for a long while. 
* What worked for me and simplest to implement was: [Node development with typescript](https://bertrandg.github.io/node-development-with-typescript-and-vscode/)

### Debugging Mocha Tests
* Using [node-inspector](https://github.com/node-inspector/node-inspector) as mentioned in [stackoverflow](http://stackoverflow.com/a/15884692)

1. write mocha tests
1. install node-inspector
1. start node-inspector -- it will now be listening on 5858
1. start the mocha test with --debug-brk (mocha ./dist/proxy/test --debug-brk)
1. at this point the mocha test is paused on the first line
1. open a web browser and go to localhost:5858
1. (optional: add a debugger line at the top of your test file, set breakpoints after it stops in that file)
1. hit F10 to get the code to go
1. node-inspector will stop on any line that has debugger on it. Occasionally it won't move the code file's window to the right place, so you'll have to hit F10 to get it to step to the next line and show where it's at in the file.


### A proxy server in 20 lines
* Wanted to write a proxy server from scratch
* Found this post which did just that: [A proxy server in 20 lines](http://www.catonmat.net/http-proxy-in-nodejs/)
* I had to modify the code slightly in order to get it to work, that's because http.createClient 
was deprecated. The work-around used is from [this answer in StackOverflow](http://stackoverflow.com/a/22482780)
* Ended up using [http-proxy](https://github.com/nodejitsu/node-http-proxy) instead of forging my own 

### Best Practices for Node.js Development
* Referred to this a good bit:
  [Heroku's Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices#use-a-smart-npmrc)

### Typescript Mixins
* [Typescript Mixins](https://www.typescriptlang.org/docs/handbook/mixins.html) 
* This link included an example of assignable methods, which was most helpful

### Proper error handling in Node
* This appears to be the definitive guide on [node error handling](https://www.joyent.com/node-js/production/design/errors#fn:1)

### Converting local file paths to urls
* Just a handy utility: [FilePathToURL](http://jsfiddle.net/StephenLujan/r6DYy/)