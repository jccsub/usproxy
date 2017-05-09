

interface ErrorCallback {
  (err, req, res) : void
}

interface ProxyResponseCallback {
  (proxyRes, req, res) : void
}

interface ProxyRequestCallback {
  (proxyReq, req, res) : void
}

export class ProxyOptions {
  public target : string;
  public changeOrigin : boolean;
  public logLevel : string;
  public onError : ErrorCallback;
  public onProxyRes : ProxyResponseCallback;
  public onProxyReq : ProxyRequestCallback;
}