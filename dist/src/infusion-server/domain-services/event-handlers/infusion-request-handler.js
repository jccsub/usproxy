"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionRequestHandler {
    constructor(log, req, context) {
        this.dataAvailable = false;
        this.log = log;
        this.req = req;
        this.context = context;
        this.context.request.body = '';
    }
    onData(chunk) {
        this.log.debug(`InfusionRequestHandler.onData`);
        this.dataAvailable = true;
        this.context.request.body += chunk;
    }
    onEnd() {
        this.log.debug(`InfusionRequestHandler.onEnd`);
        this.populateContextWithReq(this.context, this.req);
    }
    getCookiesFromRequest(req) {
        try {
            let cookieMap = new Map();
            req.headers['cookie'].split(';').forEach(element => {
                let keyValuePair = element.split('=');
                cookieMap[keyValuePair[0].trim()] = keyValuePair[1].trim();
            });
            return cookieMap;
        }
        catch (exception) {
            return new Map();
        }
    }
    populateContextWithReq(context, req) {
        this.context.request.url = this.req.url;
        this.context.request.host = this.req.headers.host;
        this.context.request.protocol = (this.req.connection.encrypted) ? 'https' : 'http';
        this.context.request.method = this.req.method;
        let cookieMap = this.getCookiesFromRequest(req);
        this.context.request.sessionId = cookieMap['ASP.NET_SessionId'];
        //this.print(this.req.headers);   
    }
}
exports.InfusionRequestHandler = InfusionRequestHandler;
//# sourceMappingURL=infusion-request-handler.js.map