import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createDrawerNavigator, DrawerNavigationOptions, DrawerNavigationProp } from "@react-navigation/drawer"
import {
  BottomTabNavigationConfig,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs/lib/typescript/src/types"
import { RouteProp, DefaultNavigatorOptions, ParamListBase } from "@react-navigation/native"
import { PageName } from "./Navigation"
import { StackNavigationConfig, StackNavigationOptions } from "@react-navigation/stack/lib/typescript/src/types"
import { DrawerNavigationConfig } from "@react-navigation/drawer/lib/typescript/src/types"
import { Children, ReactElement } from "react"
import * as React from "react"
import { navigationRef } from "./RootNavigation"

export enum RouterType {
  None,
  Stack,
  Tab,
  Drawer,
}

export class Router {
  //
  // —————— 此文件就是为了拿到以下字段，其他代码都是react-navigation抄过来的

  static PageNameLists = {
    stackList: [],
    tabList: [],
    drawerList: [],
  }

  static getPageRouterType(pageName: PageName, priorityType: RouterType = RouterType.None): RouterType {
    const types = this.getPageRouterTypes(pageName)
    switch (types.length) {
      case 0:
        return RouterType.None
      case 1:
        return types[0]
      default: {
        if (types.indexOf(priorityType) != -1) {
          return priorityType
        }
        const isStack = navigationRef?.current?.getRootState().routes.length > 1
        return isStack ? RouterType.Stack : RouterType.Tab
      }
    }
  }

  static getPageRouterTypes(pageName: PageName): Array<RouterType> {
    const isStack = this.PageNameLists.stackList.indexOf(pageName) != -1
    const isTab = this.PageNameLists.tabList.indexOf(pageName) != -1
    const isDrawer = this.PageNameLists.drawerList.indexOf(pageName) != -1

    const types = []
    isStack && types.push(RouterType.Stack)
    isTab && types.push(RouterType.Tab)
    isDrawer && types.push(RouterType.Drawer)
    return types
  }

  // —————————————————————————————————————————————————————————————————————————————————

  private static _Stack = createStackNavigator()
  private static _Tab = createBottomTabNavigator()
  private static _Drawer = createDrawerNavigator()

  static StackScreen = Router._Stack.Screen
  static TabScreen = Router._Tab.Screen
  static DrawerScreen = Router._Drawer.Screen

  // 顶部导航
  static StackNavigator(
    props: {
      initialRouteName?: PageName;
      screenOptions?: StackNavigationOptions | ((props: { route: RouteProp<Record<string, object>, string>; navigation: StackNavigationProp<{ [x: string]: object }> }) => StackNavigationOptions);
    } & StackNavigationConfig &
      DefaultNavigatorOptions<StackNavigationOptions>,
  ) {
    //@ts-ignore// 保存页面名
    Children.forEach(props.children, (child: ReactElement<{ name: PageName }>) => {
      Router.PageNameLists.stackList.push(child.props.name)
    })
    return <Router._Stack.Navigator {...props} />
  }

  // 底部标签栏
  static TabNavigator(
    props: {
      initialRouteName?: PageName;
      screenOptions?:
        | BottomTabNavigationOptions
        | ((props: { route: RouteProp<Record<string, object>, string>; navigation: BottomTabNavigationProp<{ [x: string]: object }> }) => BottomTabNavigationOptions);
    } & BottomTabNavigationConfig &
      DefaultNavigatorOptions<BottomTabNavigationOptions>,
  ) {
    //@ts-ignore// 保存页面名
    Children.forEach(props.children, (child: ReactElement<{ name: PageName }>) => {
      Router.PageNameLists.tabList.push(child.props.name)
    })
    return <Router._Tab.Navigator {...props} />
  }

  // 侧边栏
  static DrawerNavigator(
    props: {
      initialRouteName?: PageName;
      screenOptions?: DrawerNavigationOptions | ((props: { route: RouteProp<Record<string, object>, string>; navigation: DrawerNavigationProp<{ [x: string]: object }> }) => DrawerNavigationOptions);
    } & DrawerNavigationConfig &
      DefaultNavigatorOptions<DrawerNavigationOptions>,
  ) {
    //@ts-ignore// 保存页面名
    Children.forEach(props.children, (child: ReactElement<{ name: PageName }>) => {
      Router.PageNameLists.drawerList.push(child.props.name)
    })
    return <Router._Drawer.Navigator {...props} />
  }
}
