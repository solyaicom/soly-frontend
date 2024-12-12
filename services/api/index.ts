import axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import _, { isEmpty } from "lodash";
import { v4 as uuid } from "uuid";
import { ofetch, FetchOptions, FetchResponse, FetchError } from "ofetch";

export const FETCH_DOMAIN = {
  TOKEN_RATE: "@apiTokenRate",
  API: "@api",
};

class FetchInstance {
  getUrl = (url: string) => {
    return url.replace("@api", `${AppConfig.env.API_BASE_URL}`);
  };

  paramsSerializer = (params: any) => {
    const serializerParams = Object.entries(params)
      .filter(([, value]) => {
        return Array.isArray(value) ? !isEmpty(value) : !!value;
      })
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value as string | number | boolean)}`;
      })
      .join("&");
    return serializerParams;
  };

  getConfigWithToken = (config: any = {}): FetchOptions => {
    let headers = config.headers || {};
    const storeClientId = localStorage.getItem("client_key");
    const id = storeClientId || uuid();
    if (!storeClientId) {
      localStorage.setItem("client_key", id);
    }
    headers = {
      ...headers,
    };
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      headers = {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      };
    }
    return {
      ...config,
      mode: "cors",
      headers,
      // paramsSerializer: this.paramsSerializer,
    };
  };

  handlerError = async ({ err, reject, ...arg }: any) => {
    console.log("handler err", arg, err.response);
    reject(err);
  };

  get = <ResponseType>(url: string, config?: FetchOptions) => {
    return new Promise(async (res: (value: { data: ResponseType }) => void, reject: (axiosError: AxiosError) => void) => {
      ofetch(this.getUrl(url), { method: "GET", ...this.getConfigWithToken(config) })
        .then((v: any) => res({ data: v }))
        .catch(async (err) => {
          this.handlerError({
            err,
            res,
            reject,
            _data: { url, config },
            method: "get",
          });
        });
    });
  };

  delete = async <ResponseType>(url: string, config?: FetchOptions) => {
    return ofetch(this.getUrl(url), { method: "DELETE", ...this.getConfigWithToken(config) });
  };

  post = async <ResponseType>(url: string, data: any, config?: FetchOptions) => {
    return new Promise(async (res: (value: { data: ResponseType }) => void, reject: (axiosError: AxiosError) => void) => {
      ofetch(this.getUrl(url), { body: data, method: "POST", ...this.getConfigWithToken(config) })
        .then((v: any) => res({ data: v }))
        .catch(async (err) => {
          this.handlerError({
            err,
            res,
            reject,
            _data: { url, config, data },
            method: "post",
          });
        });
    });
  };

  put = async <ResponseType>(url: string, data: Record<string, any> = {}, config?: FetchOptions) => {
    return ofetch(this.getUrl(url), { method: "PUT", body: data, ...this.getConfigWithToken(config) }).then((v: any) => ({ data: v }));
  };

  getOtherUrl = <ResponseType>(url: string) => {
    return new Promise(async (res: (value: FetchResponse<ResponseType>) => void, reject: (axiosError: AxiosError) => void) => {
      axios
        .get<ResponseType>(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_1_0) AppleWebKit/537.36 (KHTML, like Gecko) ReactNativeDebugger/0.12.1 Chrome/87.0.4280.141 Electron/11.4.6 Safari/537.36",
          },
        })
        .then((v: any) => res(v))
        .catch(async (err) => {
          this.handlerError({
            err,
            res,
            reject,
            _data: { url },
            method: "get",
          });
        });
    });
  };
}

// Singleton
const Fetch = new FetchInstance();

export default Fetch;
