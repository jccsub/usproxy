# Design

## Classes

### Proxy

#### Proxy Public Members

##### constructor(target,listenerSupport,logger)

##### listen(port)

##### addListener(logger, context, listener)

### ProxyListener interface

#### ProxyListener  Members

##### handleEvent(logger, context) 

### ParseListener implements ProxyListener

#### ParseListener Public Members

### RequestListener implements ProxyListener

#### RequestListener Public Members
Allows for modifying the request before it is sent to the server. (See "Setup a stand-alone proxy server with proxy request header re-writing" [here](https://www.npmjs.com/package/http-proxy#listening-for-proxy-events)
 for more details)

### ResponseListener implements ProxyListener

#### ResponseListener Public Members

(See [harmon](https://github.com/No9/harmon) for more details)

##### searchAndReplace(logger, context, searchForSelector,replaceHtmlString)

### RedirectListener implements ProxyListener

#### RedirectListener Public Members

### ErrorListener implements ProxyListener

#### ErrorListener Public Members

See [Listening for proxy events](https://www.npmjs.com/package/http-proxy#listening-for-proxy-events) for more information


## Notes

Using http-proxy:
