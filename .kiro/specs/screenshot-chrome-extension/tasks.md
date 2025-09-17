# 実装計画

- [ ] 1. プロジェクトの基本構造とマニフェストの設定
  - [x] 1.1 `manifest.json` を作成し、拡張機能の名前、説明、バージョン、Manifest V3を指定する。
    - `action` を設定して `popup.html` をデフォルトのポップアップとして登録する。
    - _Requirements: 3.1_
  - [x] 1.2 `background.js` をService Workerとして `manifest.json` に登録する。
    - _Requirements: 1.1, 1.2, 1.3, 2.2_
  - [x] 1.3 `popup.html` と `popup.css` を作成し、「表示領域」「ページ全体」「選択範囲」の3つのボタンを配置する。
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 1.4 `preview.html` と `preview.css` の初期ファイルを作成し、画像表示エリアと「ダウンロード」「コピー」ボタンを配置する。
    - _Requirements: 2.1_

- [ ] 2. ポップアップUIと基本的な撮影フローの実装
  - [x] 2.1 `popup.js` を作成し、各撮影ボタンにクリックイベントリスナーを追加する。
  - [x] 2.2 ボタンクリック時に、対応する撮影モード（例：`captureVisible`）をペイロードとして `background.js` にメッセージを送信する機能を実装する。
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 2.3 `background.js` で `chrome.runtime.onMessage` リスナーを実装し、`popup.js` からのメッセージをコンソールに出力して受信を確認する。

- [ ] 3. 「表示領域のキャプチャ」機能の実装
  - [x] 3.1 `background.js` で `captureVisible` メッセージを受け取ったら、`chrome.tabs.captureVisibleTab` APIを呼び出す。
    - _Requirements: 1.1_
  - [x] 3.2 撮影成功後、返された画像データ（Data URL）を `preview.html` にクエリパラメータとして付与し、`chrome.tabs.create` で新しいタブで開く機能を実装する。
    - _Requirements: 2.1_
  - [x] 3.3 `preview.js` で、URLから画像データを取得し、ページの `<img>` 要素に表示する機能を実装する。
    - _Requirements: 2.1_

- [ ] 4. プレビューページの画像操作機能の実装
  - [x] 4.1 `preview.js` の「ダウンロード」ボタンに、画像データをPNGファイルとしてダウンロードする機能を実装する。
    - _Requirements: 2.2_
  - [x] 4.2 `preview.js` の「クリップボードにコピー」ボタンに、`Clipboard API` を使って画像をクリップボードにコピーする機能を実装する。
    - _Requirements: 2.3_

- [ ] 5. 「選択範囲のキャプチャ」機能の実装
  - [x] 5.1 `background.js` で `captureArea` メッセージを受け取ったら、`chrome.scripting.executeScript` を使って現在のタブに `content_script.js` を注入する。
    - `manifest.json` に `scripting` パーミッションを追加する。
    - _Requirements: 1.3_
  - [x] 5.2 `content_script.js` で、ページ全体を覆う半透明のオーバーレイと、マウス操作で範囲を選択するためのUIを実装する。
  - [x] 5.3 ユーザーが範囲選択を完了したら、選択範囲の座標（x, y, width, height）を `background.js` にメッセージで送信する。
  - [x] 5.4 `background.js` で座標を受け取り、`captureVisibleTab` で撮影した画像を指定された座標でトリミングし、プレビューページで表示するロジックを実装する。
    - _Requirements: 1.4_

- [ ] 6. 「ページ全体」のキャプチャ機能の実装
  - [x] 6.1 `background.js` で `captureFullPage` メッセージを受け取ったら、`content_script.js` を注入してページ全体の高さを取得する。
  - [x] 6.2 取得した高さに基づき、ページを自動でスクロールさせながら複数回 `captureVisibleTab` を呼び出すロジックを実装する。
  - [x] 6.3 撮影した複数の画像を結合（スティッチ）して1枚の画像にし、プレビューページで表示する機能を実装する。
    - _Requirements: 1.2_

- [ ] 7. キーボードショートカット機能の実装
  - [ ] 7.1 `manifest.json` の `commands` セクションに、各撮影アクション（`captureVisible`, `captureFullPage`, `captureArea`）を定義する。
    - _Requirements: 3.1_
  - [ ] 7.2 `background.js` で `chrome.commands.onCommand` リスナーを実装し、コマンド名に応じて対応する撮影ロジックを直接呼び出す。
    - _Requirements: 3.2_
