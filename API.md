# Screenshot Extension API仕様書

## 概要
Chrome拡張機能「Screenshot Extension」の内部API仕様とメッセージフロー定義です。

## メッセージAPI

### Background Script ⇄ Popup通信

#### 撮影要求メッセージ
**送信者**: popup.js  
**受信者**: background.js

```javascript
// 表示領域キャプチャ
chrome.runtime.sendMessage({ action: 'captureVisible' });

// ページ全体キャプチャ  
chrome.runtime.sendMessage({ action: 'captureFullPage' });

// 範囲選択キャプチャ
chrome.runtime.sendMessage({ action: 'captureArea' });
```

### Background Script ⇄ Content Script通信

#### 選択範囲キャプチャ完了
**送信者**: content_script.js  
**受信者**: background.js

```javascript
chrome.runtime.sendMessage({ 
  action: 'captureSelectedArea', 
  area: {
    x: number,           // 選択範囲X座標
    y: number,           // 選択範囲Y座標  
    width: number,       // 選択範囲幅
    height: number,      // 選択範囲高さ
    devicePixelRatio: number  // デバイス倍率
  }
});
```

### Background Script ⇄ Offscreen通信

#### 画像クロップ要求
**送信者**: background.js  
**受信者**: offscreen.js

```javascript
chrome.runtime.sendMessage({
  action: 'cropImage',
  dataUrl: string,     // 元画像データURL
  area: {
    x: number,         // クロップX座標
    y: number,         // クロップY座標
    width: number,     // クロップ幅  
    height: number,    // クロップ高さ
    devicePixelRatio: number  // デバイス倍率
  }
});
```

#### 画像ステッチ要求
**送信者**: background.js  
**受信者**: offscreen.js

```javascript
chrome.runtime.sendMessage({
  action: 'stitchImages',
  captures: string[],  // 複数画像のデータURL配列
  pageDimensions: {
    pageHeight: number,       // ページ全体高さ
    viewportHeight: number,   // ビューポート高さ
    scrollbarWidth: number,   // スクロールバー幅
    devicePixelRatio: number  // デバイス倍率
  }
});
```

#### 処理完了通知
**送信者**: offscreen.js  
**受信者**: background.js

```javascript
// クロップ完了
chrome.runtime.sendMessage({ 
  action: 'cropComplete', 
  dataUrl: string 
});

// ステッチ完了
chrome.runtime.sendMessage({ 
  action: 'stitchComplete', 
  dataUrl: string 
});
```

### Background Script ⇄ Preview通信

#### スクリーンショットデータ要求
**送信者**: preview.js  
**受信者**: background.js

```javascript
chrome.runtime.sendMessage({ 
  action: 'getScreenshotData', 
  tabId: number 
});
```

#### スクリーンショット表示
**送信者**: background.js  
**受信者**: preview.js

```javascript
chrome.tabs.sendMessage(tabId, { 
  action: 'displayScreenshot', 
  dataUrl: string,  // 画像データURL
  title: string     // ページタイトル
});
```

## Chrome API使用

### Tabs API
```javascript
// アクティブタブ取得
chrome.tabs.query({ active: true, currentWindow: true })

// 表示領域キャプチャ
chrome.tabs.captureVisibleTab(null, { format: 'png' })

// 新しいタブ作成
chrome.tabs.create({ url: 'preview.html' })

// メッセージ送信
chrome.tabs.sendMessage(tabId, message)
```

### Scripting API
```javascript
// コンテンツスクリプト注入
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  files: ['content_script.js']
})

// 関数実行
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: functionToExecute,
  args: [argument1, argument2]
})

// CSS注入・削除
chrome.scripting.insertCSS({ target: { tabId }, css: cssString })
chrome.scripting.removeCSS({ target: { tabId }, css: cssString })
```

### Offscreen API
```javascript
// Offscreenドキュメント作成
chrome.offscreen.createDocument({
  url: '/offscreen.html',
  reasons: ['DOM_PARSER'],
  justification: 'Image cropping requires a DOM environment (canvas).'
})

// Offscreenドキュメント削除
chrome.offscreen.closeDocument()
```

## データモデル

### ScreenshotData
```javascript
{
  dataUrl: string,  // Base64エンコードされた画像データ
  title: string     // ページタイトル
}
```

### CaptureArea
```javascript
{
  x: number,                // X座標（CSS pixel）
  y: number,                // Y座標（CSS pixel）
  width: number,            // 幅（CSS pixel）
  height: number,           // 高さ（CSS pixel）
  devicePixelRatio: number  // デバイスピクセル比
}
```

### PageDimensions
```javascript
{
  pageHeight: number,       // ページ全体高さ（CSS pixel）
  viewportHeight: number,   // ビューポート高さ（CSS pixel）
  scrollbarWidth: number,   // スクロールバー幅（CSS pixel）
  devicePixelRatio: number  // デバイスピクセル比
}
```

## エラーハンドリング

### 権限エラー
```javascript
try {
  await chrome.scripting.executeScript({...});
} catch (error) {
  console.error('Error executing script:', error.message);
}
```

### キャプチャエラー
```javascript
try {
  const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
} catch (error) {
  console.error('Error capturing visible tab:', error.message);
}
```

## パフォーマンス最適化

### 画像処理
- OffscreenCanvasを使用したバックグラウンド処理
- デバイスピクセル比を考慮した高解像度対応
- メモリ効率的な画像ステッチアルゴリズム

### UI応答性
- 非同期処理によるUI blocking回避
- プレビューページでの遅延読み込み
- 適切なタイミングでのリソース解放