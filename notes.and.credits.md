# bookm Notes and Credits

<!-- TOC -->

- [bookm Notes and Credits](#bookm-notes-and-credits)
  - [General Notes](#general-notes)
  - [Conventions Used](#conventions-used)
    - [Use exact versions for dependencies](#use-exact-versions-for-dependencies)
    - [Lowercase file names](#lowercase-file-names)
    - [General Coding Conventions](#general-coding-conventions)
    - [Define interfaces for callbacks](#define-interfaces-for-callbacks)
    - [Event handlers in TypeScript](#event-handlers-in-typescript)
      - [TypeScript EventHandler Property](#typescript-eventhandler-property)
      - [Node.js EventEmitter with Custom Events](#nodejs-eventemitter-with-custom-events)
  - [Dependencies](#dependencies)
    - [Using Winston logger](#using-winston-logger)
    - [Using gulp as build tool](#using-gulp-as-build-tool)
    - [Using Express](#using-express)
    - [Using Typescript](#using-typescript)
    - [Using Mocha for test support](#using-mocha-for-test-support)
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
    - [Debugging ES6 in VS Code](#debugging-es6-in-vs-code)
    - [A proxy server in 20 lines](#a-proxy-server-in-20-lines)
    - [Best Practices for Node.js Development](#best-practices-for-nodejs-development)
    - [Typescript Mixins](#typescript-mixins)
    - [Proper error handling in Node](#proper-error-handling-in-node)
    - [Converting local file paths to urls](#converting-local-file-paths-to-urls)

<!-- /TOC -->

## General Notes

* I think Box corrupts my node_modules folder. Moving to non-box location and just using git.

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



### Using Express
* Instead of Koa(2)
* Will probably go back and replace express later. But for now, just to keep things moving...

### Using Typescript
The following was a quick intro into using typescript with node:
* [Developing a restful api with node and typescript](http://mherman.org/blog/2016/11/05/developing-a-restful-api-with-node-and-typescript/#.WOOdm28rLmg)

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
The above "test" pattern is working.

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

### Debugging ES6 in VS Code

* Struggled with this for a long while. 
* What worked for me and simplest to implement was: [Node development with typescript](https://bertrandg.github.io/node-development-with-typescript-and-vscode/)

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