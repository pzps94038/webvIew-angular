import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Native } from './native.model';
declare let window: Native
@Injectable({
  providedIn: 'root'
})
export class NativeService{

  private _init: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   *
   * @param methodName 交互名稱
   * @param params 傳入物件
   * @param func callBackFunction
   */
  callBridge<T = null, U = null>(methodName: string, params: U, func?: (callback: T)=> void){
    if (window.WebViewJavascriptBridge) {
      this.bridgeInit();
      window.WebViewJavascriptBridge.callHandler(methodName, params, func);
    }
    else{
      document.addEventListener(
        'WebViewJavascriptBridgeReady',
        ()=> {
          this.bridgeInit();
          window.WebViewJavascriptBridge.callHandler(methodName, params, func);
        },
        false
      );
    }
  }

  /**
   * 初始化bridge，不然接不到callback
   */
  bridgeInit(){
    if(!this._init.value){
      window.WebViewJavascriptBridge.init();
      this._init.next(true);
    }
  }
}
