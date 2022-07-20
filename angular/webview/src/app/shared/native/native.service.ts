import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { Native } from './native.model';
declare let window: Native
@Injectable({
  providedIn: 'root'
})
export class NativeService{

  private _init: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * @param methodName 交互名稱
   * @param params 傳入物件
   */
  callBridge<T = null, U = null>(methodName: string, params: U){
    if (window.WebViewJavascriptBridge) {
      this.bridgeInit();
      return from(new Promise((resolve) => {
        window.WebViewJavascriptBridge.callHandler(methodName, params, (callback)=> resolve(callback));
      })) as Observable<T>;
    }
    else{
      return from(new Promise((resolve)=>{
        document.addEventListener(
          'WebViewJavascriptBridgeReady',
          ()=> {
            this.bridgeInit();
            window.WebViewJavascriptBridge.callHandler(methodName, params, (callback)=> resolve(callback));
          },
          false
        );
      })) as Observable<T>
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
