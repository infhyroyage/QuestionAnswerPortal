# QuestionAnswerPortal

[![Build and Deploy Question Answer Portal to GitHub Pages](https://github.com/infhyroyage/QuestionAnswerPortal/actions/workflows/build-deploy-pages.yaml/badge.svg)](https://github.com/infhyroyage/QuestionAnswerPortal/actions/workflows/build-deploy-pages.yaml)

## 概要

[Microsoft ID Platform](https://learn.microsoft.com/ja-jp/azure/active-directory/develop/v2-overview)経由で認証認可を行ったもと、[QuestionAnswerSwagger](https://github.com/infhyroyage/QuestionAnswerSwagger)に従った API サーバーのレスポンスから Web アプリケーションを構成する。

## 使用する主要なパッケージのバージョン

| 名称       | バージョン |
| ---------- | ---------- |
| Next.js    | 13.2.4     |
| Node.js    | 16.19.0    |
| React      | 18.2.0     |
| Typescript | 4.9.5      |

## 初期構築

事前に API サーバーをデプロイした前提のもと、GitHub Pages を構築する事前準備として、以下の順で初期構築を必ずすべて行う必要がある。

1. Microsoft ID Platform 認証認可用サービスプリンシパルの発行
2. リポジトリの変数設定

### 1. Microsoft ID Platform 認証認可用サービスプリンシパルの発行

[Microsoft ID Platform](https://learn.microsoft.com/ja-jp/azure/active-directory/develop/v2-overview)経由で Web アプリケーションに認証認可を実現するためのサービスプリンシパル QATranslator_MSAL を以下の手順で発行する。

1. Azure Portal から Azure AD に遷移する。
2. App Registrations > New registration の順で押下し、以下の項目を入力後、Register ボタンを押下してサービスプリンシパルを登録する。
   - Name : `QATranslator_MSAL`
   - Supported account types : `Accounts in this organizational directory only`
   - Redirect URI : `Single-page application(SPA)`(左) と `https://infhyroyage.github.io/QuestionAnswerPortal`(右)
3. 登録して自動遷移した「QATranslator_MSAL」の Overview にある「Application (client) ID」の値(=クライアント ID)を手元に控える。
4. Expose an API > Application ID URI の右にある小さな文字「Set」を押下し、Application ID URI の入力欄に`api://{3で手元に控えたクライアントID}`が自動反映されていることを確認し、Save ボタンを押下する。
5. Expose an API > Scopes defined by this API にある「Add a scope」を押下し、以下の項目を入力後、Save ボタンを押下する。
   - Scope name : `access_as_user`
   - Who can consent? : `Admins and users`
   - Admin consent display name : `QATranslator`
   - Admin consent description : `Allow react app to access QATranslator backend as the signed-in user`
   - User consent display name :`QATranslator`
   - User consent description : `Allow react app to access QATranslator backend on your behalf`
   - State : `Enabled`
6. API permissions > Configured permissions の API / Permissions name に、Microsoft Graph API の「User.Read」が既に許可されていることを確認し、「Add a permission」を押下後、以下の順で操作する。
   1. 「My APIs」タブの`QATranslator_MSAL`を選択。
   2. What type of permissions does your application require?にて「Delegated permissions」を選択。
   3. `QATranslator`の`access_as_user`のチェックボックスを選択。
   4. Add permissions ボタンを押下。
7. Manifest から JSON 形式のマニフェストを表示し、`"accessTokenAcceptedVersion"`の値を`null`から`2`に変更する。

### 2. リポジトリの変数設定

QuestionAnswerPortal リポジトリの Setting > Secrets And variables > Actions の Variables タブから「New repository variable」ボタンを押下して、下記の通り変数をすべて設定する。

| 変数名                     | 変数値                                                                |
| -------------------------- | --------------------------------------------------------------------- |
| API_URI                    | オリジン先で`/api`のパスをエンドポイントに持つ API サーバーのオリジン |
| AZURE_AD_SP_MSAL_CLIENT_ID | 1.で発行した QATranslator_MSAL のクライアント ID                      |
| AZURE_TENANT_ID            | Azure ディレクトリ ID                                                 |

## localhost 環境構築

GitHub Pages を構築せず、localhost の 3000 番のポート上で Web サーバーを起動することもできる。
以下では、localhost の 9229 番のポート上で API サーバーを起動したもとで、localhost に Web サーバーを構築・削除する手順を示す。

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

[Swagger UI](https://infhyroyage.github.io/QuestionAnswerSwagger/)参照。

## 完全初期化

初期構築以前の完全なクリーンな状態に戻すためには、初期構築で行ったサービスプリンシパル・変数それぞれを以下の順で削除すれば良い。

1. リポジトリの各シークレット・変数の削除
2. Microsoft ID Platform 認証認可用サービスプリンシパルの削除

### 1. リポジトリの変数の削除

QuestionAnswerPortal リポジトリの Setting > Secrets And variables > Actions より、Variables タブから初期構築時に設定した各変数に対し、ゴミ箱のボタンを押下する。

### 2. Microsoft ID Platform 認証認可用サービスプリンシパルの削除

1. Azure Portal から Azure AD > App Registrations に遷移する。
2. QATranslator_MSAL のリンク先にある Delete ボタンを押下し、「I understand the implications of deleting this app registration.」のチェックを入れて Delete ボタンを押下する。
