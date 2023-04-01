# QuestionAnswerPortal

## 初期構築

### リポジトリのシークレット/変数設定

当リポジトリの Setting > Secrets And variables > Actions より、以下のシークレット/変数をすべて設定する。

#### シークレット

Secrets タブから「New repository secret」ボタンを押下して、下記の通りシークレットを設定する。

| シークレット名                  | シークレット値                          |
| ------------------------------- | --------------------------------------- |
| API_MANAGEMENT_SUBSCRIPTION_KEY | API Management のサブスクリプションキー |

#### 変数

Variables タブから「New repository variable」ボタンを押下して、下記の通り変数を設定する。

| 変数名                     | 変数値                                                   |
| -------------------------- | -------------------------------------------------------- |
| API_MANAGEMENT_GATEWAY_URL | API Management の Gateway URL                            |
| AZURE_AD_SP_MSAL_CLIENT_ID | Azure AD 認証認可用サービスプリンシパルのクライアント ID |
| AZURE_TENANT_ID            | ディレクトリ ID                                          |
