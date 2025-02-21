import { EdgeInsets } from 'react-native-safe-area-context';
import { Dimensions, PixelRatio, Platform } from 'react-native';

export default class BaseInfo {
  static host = 'https://m.tepin.hk'; // 接口域名
  static domains: string[]; //域名列表
  static siteId = '未知站点'; //当前选择的渠道
  static realSiteId = '未知站点'; //当前实际的渠道
  static deviceUUID: string; //设置唯一识别
  static versionName: number; //当前版本名字
  static appVersion: number; //当前版本号
  static currentVersionInfo: string; //当前版本信息
  static newestVersionInfo: string; //最新版本信息
  static width = Dimensions.get('window').width;
  static height = Dimensions.get('window').height;
  static safeArea: EdgeInsets;
  static iOS = Platform.OS == 'ios';
  static onePx = 1 / PixelRatio.get();

  static async setup() {
    switch (Platform.OS) {
      case 'android':
        break;
    }

    if (BaseInfo.appVersion > 14869) {
      // 读取本地缓存到Store，再执行1次
    }

    switch (Platform.OS) {
      case 'ios':
        break;
      case 'android':
        break;
    }
  }

  /**
   * 判断站点（多个站点用英文逗号隔开）
   * @param sites
   */
  static inSites(sites?: string | string[]): boolean {
    if (Array.isArray(sites)) {
      sites = sites.join(',');
    }
    return !!sites
      ?.toLowerCase()
      .split(',')
      .filter((v) => v == BaseInfo.siteId?.toLowerCase()).length;
  }
}
