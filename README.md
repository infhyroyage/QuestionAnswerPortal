# QuestionAnswerPortal

## 初期構築

### リポジトリの変数設定

当リポジトリの Setting > Secrets And variables > Actions より、以下の変数をすべて設定する。

#### 変数

Variables タブから「New repository variable」ボタンを押下して、下記の通り変数を設定する。

| 変数名                     | 変数値                                                   |
| -------------------------- | -------------------------------------------------------- |
| API_URI                    | `/api`の直前まで記載した API サーバーの URI              |
| AZURE_AD_SP_MSAL_CLIENT_ID | Azure AD 認証認可用サービスプリンシパルのクライアント ID |
| AZURE_TENANT_ID            | ディレクトリ ID                                          |
