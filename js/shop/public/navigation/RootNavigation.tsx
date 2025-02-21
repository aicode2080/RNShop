import * as React from 'react';
import {
  StackActions,
  NavigationContainerRef,
  TabActions,
} from '@react-navigation/native';
// import { OCHelper } from '../define/OCHelper/OCHelper';
import { PageName } from './Navigation';
import { Router, RouterType } from './Router';
import { Platform } from 'react-native';
// import { ANHelper } from '../define/ANHelper/ANHelper';
// import { CMD } from '../define/ANHelper/hp/CmdDefine';
import { Log } from '../../utils/log';
// import { mainTabHandler, TabVisibility } from '../widget/bar/MainTabComponent'
export const navigationRef = React.createRef<NavigationContainerRef<{}>>();

/**
 * @deprecated
 *
 * 废弃的方法，请使用 push 或 jumpTo
 * 廢棄的方法，請使用 push 或 jumpTo
 *
 * @param page
 * @param props
 * @param willTransition
 */
export function navigate<P extends object>(
  page: PageName,
  props?: P,
  willTransition?: boolean,
): boolean {
  //return goFirstTransitionPage(page, props, undefined, willTransition);
  return push(page, props, willTransition);
}

/**
 *
 * @param page
 * @param props
 * @param willTransition
 * @param doubleClick 是否允许连续打开界面，通常防止连续快速双击 弹开多个界面
 */
let delayClickTime = 0;
export function push<P extends object>(
  page: PageName,
  props?: P,
  willTransition?: boolean,
  doubleClick?: boolean,
): boolean {
  const curTime = new Date().getTime();
  if (curTime - delayClickTime < 666) return false;
  delayClickTime = curTime;

  return goFirstTransitionPage(page, props, RouterType.Stack, willTransition);
}

export function jumpTo<P extends object>(
  page: PageName,
  props?: P,
  willTransition?: boolean,
): boolean {
  return goFirstTransitionPage(page, props, RouterType.Tab, willTransition);
}

export function refresh<P extends object>(props?: P) {
  navigationRef?.current?.navigate(getCurrentPage(), props);
}

export function pop(): boolean {
  return pop2Page();
}

/**
 * 回退N页
 * @param pageCount 多少页
 */
export function pop2Page(pageCount: number = 1): boolean {
  const count = navigationRef?.current?.getRootState().routes.length;
  if (count < 3) {
    //检查一下Native主页下面的tab是显示还是隐藏
    switch (Platform.OS) {
      case 'ios':
        OCHelper.call('ReactNativeVC.setTabbarHidden:animated:', [false, true]);
        break;
      case 'android':
        Log('ug page menu visible 4');
        ANHelper.callAsync(CMD.VISIBLE_MAIN_TAB, { visibility: 0 });
        // mainTabHandler?.visibleTab(TabVisibility.visible)
        break;
    }
  }
  count > 1 && navigationRef?.current?.dispatch(StackActions.pop(pageCount));
  if (count > 1) {
    return true;
  } else {
    switch (Platform.OS) {
      case 'ios':
        OCHelper.call(
          'UGNavigationController.current.viewControllers.count',
        ).then((ocCount) => {
          if (ocCount == 1) {
            // 返回首页
            OCHelper.call(
              'UGNavigationController.current.popToRootViewControllerAnimated:',
              [true],
            ).then(() => {
              OCHelper.call('UGTabbarController.shared.setSelectedIndex:', [0]);
            });
          } else {
            // 返回上一页
            OCHelper.call(
              'UGNavigationController.current.popViewControllerAnimated:',
              [true],
            );
          }
        });
        break;
      case 'android':
        ANHelper.callAsync(CMD.FINISH_ACTIVITY);
        break;
    }
    return false;
  }
}

export function popToRoot() {
  const canPop = navigationRef?.current?.getRootState().routes.length > 1;
  canPop && navigationRef?.current?.dispatch(StackActions.popToTop());
  //检查一下Native主页下面的tab是显示还是隐藏
  switch (Platform.OS) {
    case 'ios':
      OCHelper.call('ReactNativeVC.setTabbarHidden:animated:', [false, true]);
      break;
    case 'android':
      Log('ug page menu visible 5');
      ANHelper.callAsync(CMD.VISIBLE_MAIN_TAB, { visibility: 0 });
      // mainTabHandler?.visibleTab(TabVisibility.visible)
      break;
  }
}

export function getStackLength() {
  return navigationRef?.current?.getRootState().routes.length;
}

// 获取当前页面
export function getCurrentPage(): PageName {
  if (navigationRef?.current?.getCurrentRoute) {
    const { name = '' } = navigationRef?.current?.getCurrentRoute() ?? {};
    // @ts-ignore
    return name;
  }
  return PageName.ChatGamesLobby;
}

export function getCurrentRoute(): { name: PageName; key: string } {
  if (navigationRef?.current?.getCurrentRoute) {
    // @ts-ignore
    return navigationRef?.current?.getCurrentRoute() ?? {};
  }
  return { name: undefined, key: undefined };
}

export function replace(name: string, params?: any) {
  try {
    navigationRef?.current?.dispatch(StackActions.replace(name, params));
  } catch (error) {}
}

// 复杂页面第一次初始化会卡顿，先去过渡页再切换（优化用户体验）
function goFirstTransitionPage(
  page: PageName,
  props: any,
  action?: RouterType,
  willTransition?: boolean,
): boolean {
  action = Router.getPageRouterType(page, action);

  if (action === RouterType.None) {
    console.log('查无此页面', page);
    return false;
  }
  const currentPage = getCurrentPage();
  if (
    currentPage === page &&
    page != PageName.SeriesLobbyPage &&
    action == RouterType.Tab &&
    getStackLength() == 1
  ) {
    console.log('页面已存在', page);
    return false;
  }

  try {
    if (!willTransition || currentPage == PageName.TransitionPage) {
      console.log('跳转到=', page, action);
      if (action == RouterType.Stack) {
        switch (Platform.OS) {
          case 'ios':
            OCHelper.call('ReactNativeVC.setTabbarHidden:animated:', [
              true,
              true,
            ]);
            break;
          case 'android':
            ANHelper.callAsync(CMD.VISIBLE_MAIN_TAB, { visibility: 8 });
            // mainTabHandler?.visibleTab(TabVisibility.gone)
            break;
        }
        const canPop = navigationRef?.current?.getRootState().routes.length > 1;

        if (canPop && currentPage == PageName.TransitionPage) {
          navigationRef?.current?.dispatch(StackActions.replace(page, props));
        } else {
          navigationRef?.current?.dispatch(StackActions.push(page, props));
        }
      } else {
        popToRoot();
        navigationRef?.current?.dispatch(TabActions.jumpTo(page, props));
      }
    } else {
      console.log('跳转到过渡页=', action);
      //检查一下Native主页下面的tab是显示还是隐藏
      if (action == RouterType.Stack) {
        switch (Platform.OS) {
          case 'ios':
            OCHelper.call('ReactNativeVC.setTabbarHidden:animated:', [
              true,
              true,
            ]);
            break;
          case 'android':
            ANHelper.callAsync(CMD.VISIBLE_MAIN_TAB, { visibility: 8 });
            // mainTabHandler?.visibleTab(TabVisibility.gone)
            break;
        }
        navigationRef?.current?.dispatch(StackActions.push(page, props));
      } else {
        popToRoot();
        navigationRef?.current?.dispatch(
          TabActions.jumpTo(PageName.TransitionPage, {
            jumpTo: page,
            props: props,
          }),
        );
      }
    }
  } catch (e) {
    Log('error=', e);
  }

  return true;
}
