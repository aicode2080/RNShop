import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { SearchBar, Tab } from '@rneui/themed';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { ShopTab } from './js/shop/tabBar';
import { Banner } from './js/shop/components/banner';
import { api_home } from './js/shop/api/http/home';
import { Log } from './js/shop/utils/log';

import { find } from 'loadsh';
import { sc375 } from './js/shop/utils/screen';
import { BannerLay } from './js/shop/components/bannerLay';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [search, setSearch] = useState('');
  const [titleList, setTitleList] = useState([]);
  const [homeList, setHomeList] = useState([]);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    position: 'relative',
    height: '100%',
  };

  useEffect(() => {
    api_home
      .getBanner({
        id: '955',
        // t: '1708658684',
        channel: 'Mobile',
        clientId: 'haiwaigou',
        version: '300',
        version_v1: '4.4.290',
        terminalType: 'H5',
        // h: 'ecaf595f1596d17949098c5e21048851',
      })
      .useSuccess((data, msg) => {
        setHomeList(data?.data ?? []);
        Log(data, msg, '========打印轮播图消息');
      });
    api_home
      .getNewTitles({
        // t: '1708663554',
        channel: 'Mobile',
        clientId: 'haiwaigou',
        version: '300',
        version_v1: '4.4.290',
        terminalType: 'H5',
        // h: '1c731956341245eba0e169dd9120f1c8',
      })
      .useSuccess((data, msg) => {
        setTitleList(data['navs']);
        Log(data, msg, '========标题');
      });
  }, []);

  const updateSearch = (v) => {
    setSearch(v);
    console.log(v);
  };

  const renderItem = (data) => {
    return (
      <View style={[styles.flex, styles.direction]}>
        {data?.map((o, i) => {
          return (
            <Text style={[styles.item]} key={o.title}>
              {o.title}
            </Text>
          );
        })}
      </View>
    );
  };
  const getDataSource = (list, type) => {
    const data = find(list, (o) => o.template_id == type);
    return data?.data;
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View>
          <SearchBar
            placeholder="请输入想要搜索的商品"
            onChangeText={updateSearch}
            value={search}
            containerStyle={{ backgroundColor: 'rgb(204, 0, 26)' }}
            inputContainerStyle={{ backgroundColor: '#f5f5f5' }}
          />
          {/* top navs */}
          {renderItem(titleList)}
          {/*  banner */}
          <Banner dataSource={getDataSource(homeList, 'bg_carousel')} />
          {/* new_banner_lay */}
          <BannerLay
            dataSource={getDataSource(homeList, 'new_banner_1image')}
          />
        </View>
        {/* <Header /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        ></View>
      </ScrollView>
      <ShopTab selectedIndex={0} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: sc375(40),
  },
  item: {
    flex: 1,
    textAlign: 'center',
  },
  direction: {
    flexDirection: 'row',
  },
});

export default App;
