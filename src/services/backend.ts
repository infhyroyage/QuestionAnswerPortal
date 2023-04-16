import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from "@azure/msal-browser";
import axios, { AxiosHeaders, AxiosResponse } from "axios";
import { backendAccessScopes } from "./msal";
import { Method } from "@/types/backend";

/**
 * axiosを用いて、バックエンドのREST APIにアクセスしたレスポンスをそのまま返す
 * @param {Method} method HTTPメソッドタイプ
 * @param {string} path パス
 * @param {string | undefined} accessToken MSALで発行したアクセストークン
 * @param {D | undefined} data リクエストデータ
 * @returns {Promise<T>} レスポンス
 */
const callByAxios = async <T, D>(
  method: Method,
  path: string,
  accessToken?: string | undefined,
  data?: D
): Promise<T> => {
  try {
    const apiUri: string | undefined = process.env.NEXT_PUBLIC_API_URI;
    if (!apiUri) {
      throw new Error("Unset NEXT_PUBLIC_API_URI");
    }
    const url: string = `${apiUri}/api${path}`;

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
        res = await axios.get<T>(url, { headers });
        break;
      case "POST":
        res = await axios.post<T, AxiosResponse<T, D>, D>(url, data, {
          headers,
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
 * @param {D | undefined} data リクエストデータ
 * @returns {Promise<T>} レスポンス
 */
export const accessBackend = async <T, D = any>(
  method: Method,
  path: string,
  instance: IPublicClientApplication,
  accountInfo: AccountInfo | null,
  data?: D
): Promise<T> => {
  const apiUri = process.env.NEXT_PUBLIC_API_URI;
  if (!apiUri) {
    throw new Error("Unset NEXT_PUBLIC_API_URI");
  }

  // localhost環境
  if (apiUri === "http://localhost:9229") {
    return await callByAxios<T, D>(method, path, undefined, data);
  }

  // 非localhost環境 & ログイン済
  const account = accountInfo === null ? undefined : accountInfo;

  try {
    const msalRes: AuthenticationResult = await instance.acquireTokenSilent({
      scopes: backendAccessScopes.accessAsUser,
      account,
    });
    return await callByAxios<T, D>(method, path, msalRes.accessToken, data);
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      try {
        const msalRes: AuthenticationResult = await instance.acquireTokenPopup({
          scopes: backendAccessScopes.accessAsUser,
        });
        return await callByAxios<T, D>(method, path, msalRes.accessToken, data);
      } catch (e) {
        throw e;
      }
    } else {
      throw err;
    }
  }
};
