import { ReqAPI } from '../questAxios';
import { HomeProps, navTitleProps } from './type';

const c = new ReqAPI('');

export class api_home {
  // 获取轮播图，广告位图片
  static getBanner(params) {
    return c.get<HomeProps>('/HWGCMS/api/cms/index', params);
  }
  // 首页导航标题
  static getNewTitles(params) {
    return c.get<navTitleProps>('/HWGCMS/api/cms/getNewTitles', params);
  }

  //
  static save(params) {
    return c.post<HomeProps>('/HWGCMS/api/cms/index', params);
  }
}
