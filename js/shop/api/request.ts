import axios, { InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { Log, DEV_DEBUG, Warn } from '../utils/log';
import BaseInfo from '../../config/base';
import { encryptParams } from './encrypt';

interface Dictionary {
  [x: string]: any;
}
export enum CachePolicyEnum {
  noCache,
  cacheOnly,
  cacheByTime,
}
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  isEncrypt?: boolean;
  cachePolicy?: CachePolicyEnum;
  expiredTime?: number;
  noToken?: boolean;
  orParams?: object;
  cipherParams?: object;
}
export const httpClient = axios.create({
  baseURL: BaseInfo?.host,
  timeout: 60000, // 0 no limit
  headers: { 'Content-Type': 'application/json' },
});
const publicParams = {
  // 公共参数
  // able: "123"
};

httpClient.interceptors.response.use(
  (response) => {
    //@ts-ignore
    const { config }: { config: CustomAxiosConfig } = response;

    if (DEV_DEBUG) {
    }
    return response;
  },
  (err) => {
    if (err && err.response) {
      Log('http error res = ', JSON.stringify(err.response));
      switch (err.response.status) {
        case 401: //请登录后再访问, 帐号已被登出
          switch (Platform.OS) {
          }
          break;
        case 500:
          Warn('500', err);
          break;
        case 503:
          Warn('503', err);
          break;
        default:
          Warn('連接錯誤', err);
      }
    } else {
      Warn('連接到服務器失敗', err);
    }
    if (err?.toString()?.indexOf('timeout') != -1) {
      return Promise.reject('伺服器回应超时');
    } else {
      return Promise.reject(err?.response ?? err);
    }
  },
);
httpClient.interceptors.request.use(async (config: CustomAxiosConfig) => {
  let params = Object.assign({}, publicParams, {
    ...config.params,
    ...config.data,
  });

  if (config.url?.includes('c=user&a=login')) {
    params = { ...params };
  } else {
    params = { ...params };
  }

  config.orParams = params;

  Log('请求的url===', config.url);
  Log('请求的params===', params);

  let { isEncrypt = true } = config;
  let encryptData = encryptParams(params);

  config.cipherParams = encryptData;

  Log('http isEncrypt encryptData 1 =', isEncrypt, config.url, encryptData);

  if (config?.method?.toLowerCase() == 'get') {
    if (isEncrypt) {
      config.url += '&checkSign=1';
    }

    Object.keys(encryptData).forEach((res) => {
      if (!config.params) {
        config.params = {};
      }
      config.params[res] = encryptData[res];
    });
  } else if (config?.method?.toLowerCase() == 'post') {
    if (isEncrypt) {
      config.url += '&checkSign=1';
    }

    if (!config.params) config.params = {};
    if (!config.data) config.data = {};
    if (encryptData['slideCode[nc_sid]']) {
      config.data.slideCode = {};
      config.data.slideCode.nc_sid = `${encryptData['slideCode[nc_sid]']}`;
      config.data.slideCode.nc_sig = `${encryptData['slideCode[nc_sig]']}`;
      config.data.slideCode.nc_token = `${encryptData['slideCode[nc_token]']}`;
      delete encryptData['slideCode[nc_sid]'];
      delete encryptData['slideCode[nc_sig]'];
      delete encryptData['slideCode[nc_token]'];
      delete config.data['slideCode[nc_token]'];
      delete config.data['slideCode[nc_sig]'];
      delete config.data['slideCode[nc_sid]'];
    }

    for (let paramsKey in encryptData) {
      config.data[paramsKey] = `${encryptData[paramsKey]}`;
    }
  }
  Log('http url 1 =', config.method, config.baseURL, config.url);

  return config;
});
