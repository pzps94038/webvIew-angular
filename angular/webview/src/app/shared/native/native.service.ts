import { Injectable } from '@angular/core';
import { Native } from './native.model';
declare let window: Native
@Injectable({
  providedIn: 'root'
})
export class NativeService {

  /**
   *
   * @param methodName 交互名稱
   * @param params 傳入物件
   * @param func callBackFunction
   */
  callBridge<T = null, U = null>(methodName: string, params: T, func?: (callback: U)=> void){
    if (window.WebViewJavascriptBridge) {
      this.bridgeInit()
      window.WebViewJavascriptBridge.callHandler(
        methodName
        ,params
        ,func
      );
    }
    else{
      document.addEventListener(
          'WebViewJavascriptBridgeReady'
          , ()=> {
            this.bridgeInit()
            window.WebViewJavascriptBridge.callHandler(
              methodName
              ,params
              ,func
            );
          },
          false
      );
    }
  }

  /**
   * 初始化bridge，不然接不到callback
   */
  bridgeInit(){
    window.WebViewJavascriptBridge.init()
  }
}
