export const DEV_DEBUG = __DEV__;

export const Log = (...s: any[]) => {
  DEV_DEBUG && console.log(...s);
};
export const Error = (...s: any[]) => {
  DEV_DEBUG && console.error(...s);
};

export const Warn = (...s: any[]) => {
  DEV_DEBUG && console.warn(...s);
};
