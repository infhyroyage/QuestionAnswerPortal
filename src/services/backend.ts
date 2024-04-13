import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from "@azure/msal-browser";
import axios, { AxiosHeaders, AxiosResponse } from "axios";
import { backendAccessScopes } from "./msal";
import { Method } from "../types/backend";

/**
 * axiosを用いて、バックエンドのREST APIにアクセスしたレスポンスをそのまま返す
 * @param {Method} method HTTPメソッドタイプ
 * @param {string} url URL
 * @param {string | undefined} accessToken MSALで発行したアクセストークン
 * @param {D | undefined} data リクエストデータ
 * @returns {Promise<T>} レスポンス
 */
const callByAxios = async <T, D>(
  method: Method,
  url: string,
  accessToken?: string | undefined,
  data?: D
): Promise<T> => {
  const headers: AxiosHeaders | undefined = accessToken
    ? new AxiosHeaders({
        "X-Access-Token": accessToken,
      })
    : undefined;

  // axios実行
  let res;
  switch (method) {
    case "GET":
      res = await axios.get<T>(url, { headers });
      break;
    case "PUT":
      res = await axios.put<T, AxiosResponse<T, D>, D>(url, data, {
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
export const accessBackend = async <T, D = never>(
  method: Method,
  path: string,
  instance: IPublicClientApplication,
  accountInfo: AccountInfo | null,
  data?: D
): Promise<T> => {
  const apiUri: string | undefined = import.meta.env.VITE_API_URI;
  const url: string = `${apiUri}/api${path}`;

  // localhost環境
  if (apiUri === "http://localhost:9229") {
    return await callByAxios<T, D>(method, url, undefined, data);
  }

  // 非localhost環境 & ログイン済
  const account = accountInfo === null ? undefined : accountInfo;

  try {
    const msalRes: AuthenticationResult = await instance.acquireTokenSilent({
      scopes: backendAccessScopes.accessAsUser,
      account,
    });
    return await callByAxios<T, D>(method, url, msalRes.accessToken, data);
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      const msalRes: AuthenticationResult = await instance.acquireTokenPopup({
        scopes: backendAccessScopes.accessAsUser,
      });
      return await callByAxios<T, D>(method, url, msalRes.accessToken, data);
    } else {
      throw err;
    }
  }
};
