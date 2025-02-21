import { Platform } from 'react-native';

// 返回结果类型
export interface ResponseObject<T = {} | [] | string> {
  code: number;
  msg: string;
  data: T;
  info: any;
}
// 错误类型
export interface ErrorObject {
  url?: string;
  params?: { [x: string]: any };
  code?: number | string | undefined;
  message?: string;
}

export class SessionModel<T = {} | [] | string> {
  // 只读
  url: string;
  params: object; // 明文加密参数
  cipherParams: object; // 加密参数
  res: ResponseObject<T>;
  err: ErrorObject;
  status: number;
  statusText: string;
  promise: Promise<ResponseObject<T>>;
  noCatchPromise: Promise<ResponseObject<T>>; // 不会走catch方法，await时请求失败也会往下走（请注意做非空判断，使用时noShowErrorHUD自动改为true）

  completion: (
    res: ResponseObject<T>,
    err: ErrorObject,
    sm: SessionModel<T>,
  ) => void;
  success: (res: ResponseObject<T>, sm: SessionModel<T>) => void;
  failure: (err: ErrorObject, sm: SessionModel<T>) => void;
  useCompletion(
    completion: (
      res: ResponseObject<T>,
      err: ErrorObject,
      sm: SessionModel<T>,
    ) => void,
  ) {
    this.completion = completion;
    return this;
  }
  useSuccess(success: (res: ResponseObject<T>, sm: SessionModel<T>) => void) {
    this.success = success;
    return this;
  }
  useFailure(failure: (err: ErrorObject, sm: SessionModel<T>) => void) {
    this.failure = failure;
    return this;
  }

  // 只写
  noShowErrorHUD: boolean;

  // 参数中如果有函数或者Promise，则取其返回值作为参数值
  static async getParams(p: object) {
    for (const k in p) {
      const v = p[k];
      if (v instanceof Promise) {
        p[k] = await v;
      }
      if (typeof v === 'function') {
        p[k] = await v();
      }
    }
    return p;
  }
}
