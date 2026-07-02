# SEO / AIO 設定メモ — 株式会社Grand Trading

このサイトに入れたSEO/AIO設定の一覧と、**公開（独自ドメイン取得）後にやること**をまとめています。

## 入れた設定（公開前）

| 項目 | 状態 | 備考 |
|---|---|---|
| `<title>` | ✅ 全8ページ | 屋号＋地域＋業種＋サービスで構成 |
| `<meta name="description">` | ✅ 全8ページ | 地域・業種・活動を自然文で |
| canonical URL | ✅ 相対URL | ドメイン非依存。github.io でも独自ドメインでも自動で正しく動く |
| OGP / Twitter Card | ✅ 全8ページ | SNS共有時のタイトル・説明・画像 |
| favicon | ✅ `favicon.ico`（＋32/48 PNG・apple-touch） | 純正ブランドロゴのシンボルマーク（地球儀＋GT）を切り出し |
| JSON-LD 構造化データ | ✅ | index=Organization+WebSite、各下層=BreadcrumbList |
| robots.txt | ✅ | 全クロール許可＋サイトマップ場所（**要ドメイン置換**） |
| sitemap.xml | ✅ | 8ページ（**要ドメイン置換**） |
| 画像alt | ✅ | 内容が伝わる説明に |
| スマホ表示 | ✅ | レスポンシブ済み |

## 検索に乗せたキーワード

屋号 **株式会社Grand Trading / Grand Trading / グランドトレーディング** ／
業種 **古物オークション・海外輸出・リユース・買取** ／
サービス **グランドオークション（BtoBライブ式古物オークション）・海外輸出（中国/タイ/フィリピン等）** ／
対応エリア（6会場）**千葉・長野・茨城・福島・三重・山梨**（本社＝千葉県八千代市、長野営業所＝松本市）

---

## ⚠️ ドメイン取得後に必ずやる「2コマンド置換」

**(1)** `robots.txt`/`sitemap.xml` の `example.com` を正式ドメインに、**(2)** 各HTMLの OGP・JSON-LD が使っている暫定の GitHub Pages URL を正式ドメインに一括置換:

```bash
sed -i 's#https://example.com#https://正式ドメイン#g' robots.txt sitemap.xml
sed -i 's#https://illflora.github.io/shisaku#https://正式ドメイン#g' *.html
```

あわせて `sitemap.xml` の `<lastmod>` を公開日（または各ページの最終更新日）に更新してください。

> 補足: `og:url` / `og:image` / `twitter:image` と JSON-LD の `url`/`logo`/`image`/パンくず `item` は**絶対URL必須**（OGPスクレイパーやGoogleのリッチリザルトは相対URLを解決しない）ため、暫定でライブの GitHub Pages URL を焼き込んであります。上の (2) がそれを正式ドメインへ切り替えます。canonical は相対のままでOK（配信ホストに自動追従します）。

## 公開後にやること（Search Console 等）

1. 独自ドメインを取得し、GitHub Pages に設定（リポジトリ Settings → Pages → Custom domain）
2. HTTPS 有効化（GitHub Pages の "Enforce HTTPS"）
3. 上記「2コマンド置換」＋ lastmod 更新を実施して push
4. [Google Search Console](https://search.google.com/search-console) にプロパティ登録
5. ドメイン所有権を確認
6. `https://正式ドメイン/sitemap.xml` を送信
7. URL検査でトップページのインデックス登録をリクエスト
8. 実際に Google 検索で表示確認（`site:正式ドメイン`）
9. AI概要（AIO）に公式HPが混ざるか経過観察

## 補足

- このサイトのデプロイ構成は別途まとめあり（GitHub Pages / リポジトリ IllFlora/shisaku / 現URL https://illflora.github.io/shisaku/ ）。
- en/ 配下は Google 翻訳へのリダイレクトスタブのため sitemap には含めていません（canonical は日本語版を指す）。
