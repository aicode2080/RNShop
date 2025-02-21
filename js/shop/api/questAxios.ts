import axios, { AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import URI from 'urijs';
import { encryptParams } from './encrypt';
import BaseInfo from '../../config/base';
import { Log, DEV_DEBUG, Error } from '../utils/log';
import { SessionModel, ErrorObject, ResponseObject } from './type';

export class ReqAPI {
  c: string;
  constructor(c) {
    this.c = c;
  }
  get<T>(path: string, params: object = {}) {
    return SessionReq.request<T>(this.c + path, params, false);
  }
  // files 字段传{key:文件路径}
  post<T>(path: string, params: object = {}, files?: { [x: string]: string }) {
    return SessionReq.request<T>(this.c + path, params, true, files);
  }
}

// 公共参数
function publicParams() {
  return { token: '' };
}

export class SessionReq {
  static CheckError: (sm: SessionModel<any>, succCode?: number) => ErrorObject;
  private static http = axios.create({
    baseURL: BaseInfo?.host,
    headers: { 'Content-Type': 'application/json' },
  });

  static request<T>(
    path: string,
    params: object = {},
    isPost: boolean = false,
    files?: { [x: string]: string },
  ): SessionModel<T> {
    typeof params == 'string' && (params = JSON.parse(params)); // 容错
    let url = `${BaseInfo.host}/api/${path}`; // 拼接url

    Log('【未加密参数】', JSON.stringify(params));
    params = Object.assign({}, publicParams(), params); // 添加公共参数

    const sm = new SessionModel<T>();
    sm.url = url;
    sm.promise = SessionModel.getParams(params)
      .then(async (params) => {
        // 登录请求传入旧token
        if (url.indexOf('c=user&a=login') != -1) {
          params['token'] = '';
        }
        sm.params = params;
        // 参数加密
        // params = encryptParams(params); // 不加密
        url += '&checkSign=1';
        sm.cipherParams = params;

        Log('【发起请求】', url);
        Log('【发起请求加密参数】', params);
        // 若是GET请求则拼接参数到URL
        if (!isPost) {
          return this.http.get<ResponseObject<T>>(
            URI(url).addQuery(params).readable(),
          );
        } else if (files && Object.keys(files).length) {
          // 上传文件
          const formData = new FormData();
          for (const k in files) {
            const uri = files[k];
            const name = uri.substring(uri.lastIndexOf('/') + 1);
            const blob: any & Blob = {
              uri: Platform.OS == 'ios' ? uri : `file://${uri}`,
              type: 'multipart/form-data',
              name: name,
            };
            formData.append(k, blob);
          }
          for (const k in params) {
            formData.append(k, params[k]);
          }
          return this.http.post<ResponseObject<T>>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          return this.http.post<ResponseObject<T>>(url, params, {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      })
      .then(({ data: res, status, statusText }) => {
        // 接口请求成功
        sm.status = status;
        sm.statusText = statusText;
        sm.res = res;
        // sm.err = SessionReq.CheckError(sm);

        // 业务逻辑错误
        if (sm.err) {
          Log('sm.err = ', sm.res, sm.err);
          return Promise.reject(sm.err);
        }
        Log('【请求成功】url = ', sm.url, JSON.stringify(res));

        // 向外回调
        sm.success && sm.success(res, sm);
        sm.completion && sm.completion(res, {}, sm);
        return Promise.resolve(res);
      })
      .catch((aErr: AxiosError<AxiosResponse<T>>) => {
        console.log(aErr, '=====错误信息');
        const { isAxiosError, response, message, code = '' } = aErr;
        const { status, statusText, data: res } = response as AxiosResponse;
        let err: ErrorObject;
        if (!sm.err && isAxiosError) {
          sm.status = status;
          sm.statusText = statusText;
          sm.res = res;
          sm.err = err = SessionReq.CheckError(sm);
        } else {
          sm.err = err = {
            code: status ?? parseInt(code),
            message: statusText ?? message,
            url,
            params,
          };
        }

        const { request, config, response: _, ...bErr } = aErr;
        Log(
          `\n【请求失败】${url} ${status ?? ''}\n`,
          'params =',
          params,
          '\n',
          'bErr =',
          bErr,
          '\n',
          'err =',
          { isAxiosError, code, res, ...err },
          '\n\n',
        );

        // 向外回调
        sm.failure && sm.failure(err, sm);
        sm.completion && sm.completion(sm.res, err, sm);
        // 显示错误信息
        !sm.noShowErrorHUD && err?.message && Error(err?.message);
        return Promise.reject(err);
      });

    // noCatchPromise 使用时不展示错误信息
    const noCatchPromise = sm.promise.catch((err) => {
      return Promise.resolve(sm.res);
    });
    Object.defineProperty(sm, 'noCatchPromise', {
      get: () => {
        sm.noShowErrorHUD = true;
        return noCatchPromise;
      },
    });
    return sm;
  }
}
