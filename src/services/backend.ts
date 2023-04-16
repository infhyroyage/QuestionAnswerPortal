import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from "@azure/msal-browser";
import axios, { AxiosHeaders } from "axios";
import { backendAccessScopes } from "./msal";
import { Headers, Method } from "@/types/backend";

/**
 * axiosを用いて、バックエンドのREST APIにアクセスしたレスポンスをそのまま返す
 * @param {Method} method HTTPメソッドタイプ
 * @param {string} path パス
 * @param {string | undefined} accessToken MSALで発行したアクセストークン
 * @param {Headers | undefined} headers リクエストヘッダー
 * @returns {Promise<T>} レスポンス
 */
const callByAxios = async <T>(
  method: Method,
  path: string,
  accessToken?: string | undefined,
  headers?: Headers | undefined
): Promise<T> => {
  try {
    const apiUri: string | undefined = process.env.NEXT_PUBLIC_API_URI;
    if (!apiUri) {
      throw new Error("Unset NEXT_PUBLIC_API_URI");
    }
    const url: string = `${apiUri}/api${path}`;

    // 非localhost環境のみ、アクセストークンをヘッダーに追加
    const axiosHeadersArgs: Headers = { ...headers };
    if (apiUri !== "http://localhost:9229") {
      if (!accessToken) {
        throw new Error("Unset accessToken");
      }
      axiosHeadersArgs["X-Access-Token"] = accessToken;
    }

    // axios実行
    let res;
    switch (method) {
      case "GET":
        res = await axios.get<T>(url, {
          headers: new AxiosHeaders(axiosHeadersArgs),
        });
        break;
      default:
        throw new Error(`Invalid method type: ${method}`);
    }
    if (res.status !== 200) {
      throw new Error(res.statusText);
    }

    return res.data;
  } catch (e) {
    throw e;
  }
};

/**
 * バックエンドのREST APIにアクセスする
 * @param {Method} method HTTPメソッドタイプ
 * @param {string} path パス
 * @param {IPublicClientApplication} instance MSALインスタンス
 * @param {AccountInfo | null} accountInfo ログイン済のアカウント情報
 * @param {Headers | undefined} headers リクエストヘッダー
 * @returns {Promise<T>} レスポンス
 */
export const accessBackend = async <T>(
  method: Method,
  path: string,
  instance: IPublicClientApplication,
  accountInfo: AccountInfo | null,
  headers?: Headers
): Promise<T> => {
  const apiUri = process.env.NEXT_PUBLIC_API_URI;
  if (!apiUri) {
    throw new Error("Unset NEXT_PUBLIC_API_URI");
  }

  // localhost環境
  if (apiUri === "http://localhost:9229") {
    return await callByAxios<T>(method, path, undefined, headers);
  }

  // 非localhost環境 & ログイン済
  const account = accountInfo === null ? undefined : accountInfo;

  try {
    const msalRes: AuthenticationResult = await instance.acquireTokenSilent({
      scopes: backendAccessScopes.accessAsUser,
      account,
    });
    return await callByAxios<T>(method, path, msalRes.accessToken, headers);
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      try {
        const msalRes: AuthenticationResult = await instance.acquireTokenPopup({
          scopes: backendAccessScopes.accessAsUser,
        });
        return await callByAxios<T>(method, path, msalRes.accessToken, headers);
      } catch (e) {
        throw e;
      }
    } else {
      throw err;
    }
  }
};
