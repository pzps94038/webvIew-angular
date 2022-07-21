import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { device, Native } from './native.model';
declare let window: Native
@Injectable({
  providedIn: 'root'
})
export class NativeService{

  private _init$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _device$: BehaviorSubject<device> = new BehaviorSubject<device>('web');

  /**
   * @param methodName 交互名稱
   * @param params 傳入物件
   */
  callBridge<T = null, U = null>(methodName: string, params?: U): Observable<T>{
    const device = this.judgeDevice();
    this.setDevice(device);
    if(device === 'web') throw new Error('not device')
    else{
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
  }

  /**
   * 初始化bridge，不然接不到callback
   */
  bridgeInit(){
    if(!this._init$.value){
      window.WebViewJavascriptBridge.init();
      this._init$.next(true);
    }
  }

  getDevice(): Observable<device>{
    return this._device$.asObservable();
  }

  setDevice(value: device){
    this._device$.next(value);
  }

  judgeDevice(): device{
    const userAgent = navigator.userAgent;
    const android = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; // android
    const iOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios
    if(android){
      return 'android';
    }else if(iOS){
      return 'ios';
    }else{
      return 'web';
    }
  }
}
