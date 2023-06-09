import { Configuration } from "@azure/msal-browser";

/**
 * MSALプロバイダー使用時のコンフィグ
 */
export const config: Configuration = {
  auth: {
    clientId: `${process.env.NEXT_PUBLIC_AZURE_AD_SP_MSAL_CLIENT_ID}`,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    // ログイン後のリダイレクト先
    redirectUri: `${process.env.NEXT_PUBLIC_AZURE_AD_APP_REDIRECT_URI}`,
    // ログアウト後のリダイレクト先
    postLogoutRedirectUri: `${process.env.NEXT_PUBLIC_AZURE_AD_APP_REDIRECT_URI}`,
  },
  cache: {
    // アクセストークンの格納先
    cacheLocation: "sessionStorage",
    // IE11/Edgeでの動作で問題が発生する場合のみtrueに設定
    storeAuthStateInCookie: false,
  },
};

/**
 * ログイン時の認証のスコープ
 */
export const loginScope = {
  scopes: [],
};

/**
 * バックエンドのREST APIアクセスのスコープ
 */
export const backendAccessScopes = {
  accessAsUser: [
    `api://${process.env.NEXT_PUBLIC_AZURE_AD_SP_MSAL_CLIENT_ID}/access_as_user`,
  ],
};
