# QuestionAnswerPortal

[![Build and Deploy Question Answer Portal to GitHub Pages](https://github.com/infhyroyage/QuestionAnswerPortal/actions/workflows/build-deploy-pages.yaml/badge.svg)](https://github.com/infhyroyage/QuestionAnswerPortal/actions/workflows/build-deploy-pages.yaml)

## 概要

[Microsoft ID Platform](https://learn.microsoft.com/ja-jp/azure/active-directory/develop/v2-overview)経由で認証認可を行ったもと、[QuestionAnswerTranslator](https://github.com/infhyroyage/QuestionAnswerTranslator)を API サーバーとする Web アプリケーションを構成する。

## 使用する主要なパッケージのバージョン

| 名称       | バージョン |
| ---------- | ---------- |
| Next.js    | 13.4.5     |
| Node.js    | 16.20.1    |
| React      | 18.2.0     |
| Typescript | 5.1.3      |

## 初期構築

Web アプリケーションをデプロイした GitHub Pages を構築する事前準備として、以下の順で初期構築を必ずすべて行う必要がある。

1. API サーバーの Azure リソース構築
2. リポジトリの変数設定

### 1. API サーバーの Azure リソース構築

[QuestionAnswerTranslator の Azure リソース環境構築の構築手順](https://github.com/infhyroyage/QuestionAnswerTranslator#azure-%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)に従って、API サーバーの Azure リソースを構築する。

### 2. リポジトリの変数設定

QuestionAnswerPortal リポジトリの Setting > Secrets And variables > Actions の Variables タブから「New repository variable」ボタンを押下して、下記の通り変数をすべて設定する。

| 変数名                     | 変数値                                                                          |
| -------------------------- | ------------------------------------------------------------------------------- |
| API_URI                    | QuestionAnswerTranslator の API Management`qatranslator-je-apim` の Gateway URL |
| AZURE_AD_SP_MSAL_CLIENT_ID | QuestionAnswerTranslator で発行した QATranslator_MSAL のクライアント ID         |
| AZURE_TENANT_ID            | Azure ディレクトリ ID                                                           |

## localhost 環境構築

GitHub Pages を構築せず、localhost の 3000 番のポート上で Web サーバーを起動することもできる。
以下では、[QuestionAnswerTranslator の localhost 環境構築](https://github.com/infhyroyage/QuestionAnswerTranslator#localhost-%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)に従って、localhost の 9229 番のポート上で API サーバーを起動したもとで、localhost に Web サーバーを構築・削除する手順を示す。

### 構築手順

1. 環境変数`NEXT_PUBLIC_API_URI`に API サーバーのオリジンを記載したファイル`.env.local`を、QuestionAnswerPortal リポジトリ直下に保存する。
   例えば、API サーバーを localhost の 9229 番のポート上で起動し、`http://localhost:9229/api`をエンドポイントに持つ場合、以下の通りに指定する。
   ```
   NEXT_PUBLIC_API_URI="http://localhost:9229"
   ```
2. ターミナルを起動して以下のコマンドを実行し、npm パッケージをインストールする。
   ```bash
   npm i
   ```
3. 2 のターミナルで以下のコマンドを実行し、localhost に Web サーバーを起動する。実行したターミナルはそのまま放置する。
   ```bash
   npm run dev
   ```

### 削除手順

構築手順の 3 で実行したターミナルに対して Ctrl+C キーを入力すると、localhost に起動した Web サーバーを停止・削除できる。

## API サーバーの API リファレンス

[Swagger UI](https://infhyroyage.github.io/QuestionAnswerTranslator/)参照。

## 完全初期化

初期構築以前の完全なクリーンな状態に戻すためには、初期構築で行ったサービスプリンシパル・変数それぞれを以下の順で削除すれば良い。

1. リポジトリの各シークレット・変数の削除
2. API サーバーの Azure リソース削除

### 1. リポジトリの変数の削除

QuestionAnswerPortal リポジトリの Setting > Secrets And variables > Actions より、Variables タブから初期構築時に設定した各変数に対し、ゴミ箱のボタンを押下する。

### 2. API サーバーの Azure リソース削除

[QuestionAnswerTranslator の Azure リソース環境構築の削除手順](https://github.com/infhyroyage/QuestionAnswerTranslator#%E5%89%8A%E9%99%A4%E6%89%8B%E9%A0%86)に従って、API サーバーの Azure リソースを削除する。
