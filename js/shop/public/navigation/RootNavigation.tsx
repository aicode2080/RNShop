import * as React from 'react';
import {
  StackActions,
  NavigationContainerRef,
  TabActions,
} from '@react-navigation/native';
import { PageName } from './Navigation';
import { Router, RouterType } from './Router';
import { Platform } from 'react-native';
import { Log } from '../../utils/log';
export const navigationRef = React.createRef<NavigationContainerRef<{}>>();

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
