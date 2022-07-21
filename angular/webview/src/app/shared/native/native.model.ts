export interface Handler{
  callHandler<T = null, U = null>(methodName: string, params: T, func?: (callback: U)=> void): void;
  init(): void;
}
export interface Native{
  WebViewJavascriptBridge: Handler;
}
export type device = 'android' | 'ios' | 'web'
