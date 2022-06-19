package com.example.webview

import android.content.ContentValues.TAG
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebSettings.LOAD_NO_CACHE
import androidx.appcompat.app.AppCompatActivity
import com.example.webview.databinding.ActivityMainBinding
import com.github.lzyzsd.jsbridge.BridgeHandler
import com.github.lzyzsd.jsbridge.BridgeWebView


class MainActivity : AppCompatActivity() {
    private lateinit var binging: ActivityMainBinding // xml active_main
    private lateinit var webView: BridgeWebView
    // web 網址
    private val url: String = "http://172.20.96.1:4200/"
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binging = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binging.root)
        webView = binging.webView
        setWebView()
    }
    private fun setWebView(){
        val setting = webView.settings
        // 支援javascript
        setting.javaScriptEnabled = true
        //將圖片調整到適合web-view的大小
        setting.loadWithOverviewMode = true
        //關閉web-view中快取
        setting.cacheMode = LOAD_NO_CACHE
        //設定可以訪問檔案
        setting.allowFileAccess = true
        //支援通過JS開啟新視窗
        setting.javaScriptCanOpenWindowsAutomatically = true
        //支援自動載入圖片
        setting.setLoadsImagesAutomatically(true)
        //設定編碼格式
        setting.defaultTextEncodingName = "utf-8"
        webView.loadUrl(url);
        setBridgeHandler()
    }
    private fun setBridgeHandler(){
        // web console.log
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.i("WebView", consoleMessage.message())
                return true
            }
        }
        // web bridgeEvent
        webView.registerHandler("submitFromWeb",
        BridgeHandler { data, function ->
            Log.i(TAG, "handler = submitFromWeb, data from web = $data")
            function.onCallBack("回傳")
        })
    }
}