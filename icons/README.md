# アイコン生成手順

ChromeWebStore公開に必要なアイコンファイルの生成方法です。

## 必要なアイコンサイズ
- 16x16 pixels (ツールバー表示用)
- 32x32 pixels (高DPI環境用ツールバー)
- 48x48 pixels (拡張機能管理ページ)
- 128x128 pixels (WebStoreストア表示用)

## 方法1: SVGから自動生成（推奨）

### 必要な依存関係をインストール
```bash
pip install Pillow cairosvg
```

### アイコン生成
```bash
cd icons
python3 generate_icons.py
```

## 方法2: PIL のみで生成

```bash
pip install Pillow
cd icons  
python3 create_simple_icons.py
```

## 方法3: 手動作成

`icon.svg`を基に、以下のサイズでPNGファイルを手動作成してください：

1. **オンラインツール使用**:
   - [SVG to PNG Converter](https://cloudconvert.com/svg-to-png)
   - [SVGOMG](https://jakearchibald.github.io/svgomg/)

2. **デザインツール使用**:
   - Figma, Adobe Illustrator, Inkscape等
   - 各サイズで書き出し

3. **ファイル命名**:
   - `icon16.png` (16x16)
   - `icon32.png` (32x32) 
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)

## デザインガイドライン

### カメラアイコンの要素
- **背景**: 青い円形（Googleブランドカラー）
- **カメラ本体**: 白いベース、グレーの詳細
- **レンズ**: 黒い円、光の反射表現
- **フラッシュ**: 黄色の小さな矩形
- **ビューファインダー**: 緑の小さな矩形
- **スクリーンショット効果**: オレンジの角部分線

### 品質要件
- **フォーマット**: PNG (透明背景サポート)
- **色深度**: 32bit RGBA
- **最適化**: ファイルサイズ最小化
- **シャープネス**: 各サイズで鮮明表示

## 確認方法

生成後、以下を確認してください：

```bash
ls -la *.png
```

必要なファイル:
- icon16.png
- icon32.png  
- icon48.png
- icon128.png

## トラブルシューティング

### Python依存関係エラー
```bash
# Ubuntu/Debian
sudo apt-get install python3-pil python3-cairo-dev

# macOS  
brew install cairo pango gdk-pixbuf libffi
pip install Pillow cairosvg

# Windows
pip install Pillow cairosvg
```

### アイコンが表示されない
1. ファイル名の確認（icon16.png等）
2. manifest.jsonのパス確認
3. ファイル権限の確認
4. PNG形式の確認