# ISS Live Orbit Tracker & Simulator

[English version is here](README.md)

国際宇宙ステーション（ISS）の現在位置を、黒基調のダークテーマ地図上でリアルタイムに追跡する単一ページのWebアプリです。昼夜の表現、軌道の描画、日時を指定したシミュレーション機能を備えています。

## 主な機能

- **ISSのリアルタイム位置表示** — 緯度・経度・高度・速度を、軌道計算（SGP4）により1秒ごとに更新します。
- **昼夜表現（ターミネーターライン）** — 地球上のどの地域が現在昼／夜なのかを地図上に重ねて表示します。
- **軌道の描画** — 過去1時間分（実績）と未来1時間分（予測）のISSの軌道を描画し、+15分／+30分／+45分／+60分の時刻バッジを表示します。
- **日時移動シミュレーション** — 任意の日時を指定して、その時点でのISSの位置を確認できます。「現在時刻に戻る」でリアルタイム表示に戻せます。
- **言語自動切り替え** — ブラウザの言語設定が日本語の場合は日本語UIを、それ以外の場合は英語UIを表示します。
- **レスポンシブデザイン**:
  - PC表示: 緯度を赤道（0°）に固定し、経度のみISSに追従して地図をパンします。
  - スマートフォン表示: ダッシュボードパネルは初期状態で折りたたまれており、地図はISSの緯度・経度の両方を中心に追従します。
- **最新のTLEデータ取得** — [CelesTrak](https://celestrak.org/) から最新の軌道要素（TLE）を取得します。取得に失敗またはタイムアウトした場合は、内蔵のフォールバックデータを使用します。

## 技術スタック

- [Leaflet.js](https://leafletjs.com/) — 地図描画
- [satellite.js](https://github.com/shashwatak/satellite-js) — SGP4軌道計算
- [leaflet.terminator](https://github.com/joergdietrich/Leaflet.Terminator) — 昼夜表現オーバーレイ
- [Esri World Dark Gray Canvas](https://www.esri.com/) — APIキー不要の無料ベースマップタイル
- Vanilla JavaScript（ビルド不要・フレームワーク不使用）

## ファイル構成

```
index.html    ページ構造・マークアップ
style.css     スタイル全般（ダークテーマ、レイアウト、レスポンシブ対応）
script.js     アプリロジック（地図・軌道計算・多言語対応・イベント処理）
config.js     任意・Git管理外: Googleタグマネージャ用のGTM_IDを設定
```

## 使い方

ライブのTLEデータをHTTPS経由で取得するため、`index.html` を `file://` で直接開くのではなく、ローカルのWebサーバー経由で配信してください。

```bash
python3 -m http.server 8000
```

その後、ブラウザで `http://localhost:8000/` を開いてください。

`config.js` は任意のファイルでGit管理対象外です。Googleタグマネージャによるアクセス解析を有効にしたい場合のみ、以下の内容で作成してください。

```js
const GTM_ID = "YOUR_GTM_ID";
```

## ライセンス

MIT License — [LICENSE](LICENSE) を参照してください。
