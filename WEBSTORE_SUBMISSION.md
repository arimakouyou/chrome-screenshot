# Chrome Web Store 申請ガイド

## 📦 パッケージ準備完了

✅ **`screenshot-extension-v1.0.0.zip`** が作成されました（20KB）

### パッケージ内容確認
- **必須ファイル**: manifest.json, background.js, content_script.js, popup.*, preview.*, offscreen.*
- **アイコン**: 16px, 32px, 48px, 128px PNG形式
- **ライセンス**: LICENSE ファイル含む
- **サイズ**: 20KB（WebStore制限内）

## 🚀 Chrome Web Store 申請手順

### 1. 開発者アカウント準備

#### 開発者登録
1. **Chrome Web Store Developer Dashboard** にアクセス
   - URL: https://chrome.google.com/webstore/devconsole/
2. **Googleアカウント** でサインイン
3. **開発者登録料** $5 を支払い（一回限り）
4. **開発者契約** に同意

#### 必要な情報
- **開発者名**: 公開される名前
- **連絡先メール**: サポート用
- **支払い情報**: 有料拡張の場合

### 2. 拡張機能の詳細設定

#### 基本情報
```
拡張機能名: Screenshot Extension
カテゴリ: 生産性 (Productivity)
言語: 英語（デフォルト）、日本語（オプション）
```

#### 説明文
**簡潔な説明（132文字以内）**:
```
Capture visible area, full page, or selected region of any webpage with one click. Download or copy to clipboard instantly.
```

**詳細説明**:
```
📸 Screenshot Extension - 簡単で強力なWebページキャプチャツール

🎯 主な機能:
• 表示領域キャプチャ - 現在のビューポートを瞬時に撮影
• ページ全体キャプチャ - 長いページも自動スクロールで完全撮影
• 範囲選択キャプチャ - ドラッグ操作で任意の領域を選択

💾 便利な保存機能:
• ワンクリックダウンロード（PNG形式）
• クリップボードに直接コピー
• 自動ファイル名生成（日時付き）

⚡ 特徴:
• Manifest V3 準拠で高速・安全
• 高解像度対応（Retina等）
• キーボードショートカット対応
• 直感的で使いやすいUI

🛡️ プライバシー:
• 外部サーバーへの送信なし
• ローカル処理のみ
• 最小限の権限要求

開発者、デザイナー、QAテスター、その他Webコンテンツを頻繁に共有する方に最適です。
```

#### キーワード
```
screenshot, capture, webpage, full page, area selection, download, clipboard, productivity
```

### 3. スクリーンショット準備

#### 必要な画像
1. **スクリーンショット** (1-5枚)
   - サイズ: 1280x800 または 640x400
   - 形式: PNG または JPEG
   - 参考: [store-assets/screenshots-guide.md](store-assets/screenshots-guide.md)

2. **アイコン** (自動設定済み)
   - 128x128: WebStore表示用
   - 48x48: 管理ページ用
   - 32x32: 高DPI環境用
   - 16x16: ツールバー用

#### 推奨スクリーンショット
1. **メインUI**: ポップアップメニュー表示
2. **範囲選択**: 選択UI動作中
3. **プレビューページ**: 結果表示画面
4. **全体キャプチャ結果**: 長いページの撮影例

### 4. 権限の説明

#### 必要な権限
- `activeTab`: 現在のタブのキャプチャ
- `scripting`: 範囲選択UI注入
- `offscreen`: 画像処理環境
- `tabs`: タブ管理

#### ユーザー向け説明文
```
この拡張機能が必要とする権限:

• 現在のタブへのアクセス: スクリーンショット撮影のため
• スクリプト実行: 範囲選択機能のため  
• オフスクリーン処理: 画像編集のため
• タブ管理: プレビューページ表示のため

全ての処理はローカルで実行され、データは外部に送信されません。
```

### 5. カテゴリ・タグ設定

#### カテゴリ
- **主カテゴリ**: 生産性 (Productivity)
- **副カテゴリ**: 開発者ツール (Developer Tools)

#### 対象ユーザー
- Web開発者
- デザイナー
- QAテスター
- ブロガー
- 学生・研究者

### 6. 公開設定

#### 公開範囲
- **推奨**: パブリック（誰でもインストール可能）
- **オプション**: 未掲載（直接リンクのみ）

#### 価格設定
- **無料** （推奨）
- 将来的にプレミアム機能追加時は有料版検討

### 7. 申請プロセス

#### ステップ 1: パッケージアップロード
1. Developer Dashboard にログイン
2. 「新しいアイテム」クリック
3. `screenshot-extension-v1.0.0.zip` をアップロード
4. アップロード完了を確認

#### ステップ 2: ストア掲載情報入力
1. **基本情報**: 名前、説明、カテゴリ
2. **アイコン**: 自動検出（確認のみ）
3. **スクリーンショット**: 1-5枚アップロード
4. **権限説明**: なぜ必要かを明記

#### ステップ 3: 価格・配布設定
1. **価格**: 無料
2. **地域**: 全世界
3. **年齢制限**: なし

#### ステップ 4: 審査提出
1. **プレビュー確認**: 最終チェック
2. **利用規約同意**: Chrome Web Store規約
3. **提出**: 「審査のため送信」ボタン

### 8. 審査プロセス

#### 審査期間
- **通常**: 1-3営業日
- **初回申請**: 最大7営業日
- **複雑な権限**: 追加審査時間

#### 審査基準
- **機能性**: 説明通りに動作するか
- **安全性**: 悪意のあるコードがないか
- **ユーザビリティ**: 使いやすいか
- **品質**: バグや問題がないか

#### よくある却下理由
- manifest.json の記述不備
- 権限の過剰要求
- 説明と実際の機能の相違
- UI/UXの品質不足

### 9. 公開後の管理

#### 統計・分析
- **インストール数**: 日次・月次
- **評価・レビュー**: ユーザーフィードバック
- **クラッシュレポート**: 技術的問題

#### アップデート手順
1. **バージョン更新**: manifest.json の version 変更
2. **新パッケージ作成**: 再度 build-package.sh 実行
3. **アップロード**: Developer Dashboard で更新
4. **審査**: 変更内容により再審査

#### サポート対応
- **ユーザーレビュー**: 建設的な返信
- **バグレポート**: 迅速な修正
- **機能要望**: 次期バージョン検討

## 🎯 申請前チェックリスト

### 技術要件
- [ ] manifest.json が Manifest V3 準拠
- [ ] 全必須ファイルが含まれている
- [ ] アイコンが全サイズ揃っている
- [ ] Chrome最新版で動作確認済み
- [ ] コンソールエラーなし

### ストア要件  
- [ ] 説明文が適切（機能・価値が明確）
- [ ] スクリーンショットが魅力的
- [ ] 権限説明が明確
- [ ] カテゴリ・キーワードが適切
- [ ] 利用規約・プライバシー準拠

### 品質要件
- [ ] UI/UXが直感的
- [ ] エラーハンドリング適切
- [ ] パフォーマンス良好
- [ ] アクセシビリティ考慮
- [ ] モバイル対応（必要に応じて）

## 📞 サポート・リソース

### 公式ドキュメント
- [Chrome Web Store Developer Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)

### コミュニティ
- [Chrome Extensions Google Group](https://groups.google.com/a/chromium.org/g/chromium-extensions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/chrome-extension)
- [Reddit r/chrome_extensions](https://www.reddit.com/r/chrome_extensions/)

### トラブルシューティング
- **審査が遅い**: 通常範囲内、待機
- **却下された**: フィードバック確認し修正
- **アップロードエラー**: パッケージサイズ・形式確認
- **権限エラー**: manifest.json 見直し

---

## 🎉 次のステップ

1. **`screenshot-extension-v1.0.0.zip`** の最終テスト
2. **スクリーンショット撮影** ([screenshots-guide.md](store-assets/screenshots-guide.md)参照)
3. **Chrome Web Store Developer Dashboard** での申請
4. **審査結果待ち** (1-7営業日)
5. **公開・プロモーション**

**成功を祈っています！** 🚀