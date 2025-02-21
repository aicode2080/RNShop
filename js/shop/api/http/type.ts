export interface HomeProps {
  username: string; // 用户名
  qq: string; // qq
  mobile: string; // 手机号
  applyReason: string; // 申请理由
  reviewResult: string; // 拒绝的理由
  reviewStatus: number; // 0 未提交  1 待审核  2 审核通过 3 审核拒绝
  isAgent: boolean; // 是否是代理  true 是   false 否
}

export interface navTitleProps {
  id: '3';
  title: '\u9996\u9875';
  h5_url: '955';
  wxapp_url: '955';
  old_android_url: '955';
  android_version: 'V3.6.8';
  new_android_url: '955';
  old_ios_url: '955';
  ios_version: 'V3.6.8';
  new_ios_url: '955';
  bg_color: '#FFFFF';
  bg_image1: '';
  bg_image2: '';
  bg_image3: '';
  sort_num: '99';
  add_time: '2021-03-19 13:25:18';
  last_update_time: '2024-02-08 22:53:13';
  bg_image1_show: '';
  bg_image2_show: '';
  bg_image3_show: '';
}
