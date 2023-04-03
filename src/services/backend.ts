import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from "@azure/msal-browser";
import axios, { AxiosHeaders } from "axios";
import { backendAccessScopes } from "./msal";
import { Method } from "@/types/backend";

/**
 * バックエンドのREST APIにアクセスする
 * @param {Method} method HTTPメソッドタイプ
 * @param {string} path パス
 * @param {IPublicClientApplication} instance MSALインスタンス
 * @param {AccountInfo | null} accountInfo ログイン済のアカウント情報
 * @returns {Promise<T>} レスポンス
 */
export const accessBackend = async <T>(
  method: Method,
  path: string,
  instance: IPublicClientApplication,
  accountInfo: AccountInfo | null
): Promise<T> => {
  const apiUri = process.env.NEXT_PUBLIC_API_URI;
  if (!apiUri) {
    throw new Error("Unset NEXT_PUBLIC_API_URI");
  }

  // localhost環境
  if (apiUri === "http://localhost:9229") {
    return await callByAxios<T>(method, path);
  }

  // 非localhost環境 & ログイン済
  const account = accountInfo === null ? undefined : accountInfo;

  try {
    const msalRes: AuthenticationResult = await instance.acquireTokenSilent({
      scopes: backendAccessScopes.accessAsUser,
      account,
    });
    return await callByAxios<T>(method, path, msalRes.accessToken);
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      try {
        const msalRes: AuthenticationResult = await instance.acquireTokenPopup({
          scopes: backendAccessScopes.accessAsUser,
        });
        return await callByAxios<T>(method, path, msalRes.accessToken);
      } catch (e) {
        throw e;
      }
    } else {
      throw err;
    }
  }
};

/**
 * axiosを用いて、バックエンドのREST APIにアクセスしたレスポンスをそのまま返す
 * @param {Method} method HTTPメソッドタイプ
 * @param {string} path パス
 * @param {string | undefined} accessToken MSALで発行したアクセストークン
 * @returns {Promise<T>} レスポンス
 */
const callByAxios = async <T>(
  method: Method,
  path: string,
  accessToken?: string | undefined
): Promise<T> => {
  try {
    const apiUri = process.env.NEXT_PUBLIC_API_URI;
    if (!apiUri) {
      throw new Error("Unset NEXT_PUBLIC_API_URI");
    }

    // 非localhost環境のみ、アクセストークンをヘッダーに追加
    let headers: AxiosHeaders | undefined = undefined;
    if (apiUri !== "http://localhost:9229") {
      if (!accessToken) {
        throw new Error("Unset accessToken");
      }
      headers = new AxiosHeaders({
        "X-Access-Token": accessToken,
      });
    }

    // axios実行
    let res;
    switch (method) {
      case "GET":
        res = await axios.get<T>(`${apiUri}/api${path}`, { headers });
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
