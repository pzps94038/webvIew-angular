import { Component } from '@angular/core';
import { NativeService } from './shared/native/native.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webview';
  showStr= '顯示';
  constructor(private native: NativeService){
    this.native.callBridge<string, string>('submitFromWeb', 'test').subscribe(data=>{
      document.getElementById('show')!.innerText = data
    })
  }
}
