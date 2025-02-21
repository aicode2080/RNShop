import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ImageBackground,
  Linking,
} from 'react-native';

import { SearchBar, Tab } from '@rneui/themed';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { ShopTab } from './js/shop/tabBar';
import { Banner } from './js/shop/components/banner';
import { api_home } from './js/shop/api/http/home';
import { Log } from './js/shop/utils/log';

import { find, filter } from 'loadsh';
import { sc375 } from './js/shop/utils/screen';
import { BannerLay } from './js/shop/components/bannerLay';
import { MenuList } from './js/shop/components/menu-list';
import { ListBannerView } from './js/shop/components/listBannerView';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [search, setSearch] = useState('');
  const [titleList, setTitleList] = useState([]);
  const [homeList, setHomeList] = useState([]);
  const [indictor, setIndictor] = useState(0);
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
        // Log(data, msg, '========打印轮播图消息');
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
        // Log(data, msg, '========标题');
      });
  }, []);

  const updateSearch = (v) => {
    setSearch(v);
    console.log(v);
  };

  const renderItem = (data) => {
    return (
      <View
        style={[
          styles.flex,
          styles.direction,
          {
            backgroundColor: bannerSource?.[indictor]?.bg_color,
          },
        ]}
      >
        {data?.map((o, i) => {
          return (
            <View
              style={{
                flex: 1,
                height: sc375(30),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              key={`${o.img_url}${i}`}
            >
              <Text
                // onPress={() => setIndictor(i)}
                style={
                  indictor === i ? [styles.itemAct, styles.item] : [styles.item]
                }
              >
                {o.title}
              </Text>
              {0 === i && (
                <View
                  style={[
                    styles.itemCurrent,
                    {
                      left: sc375(21.5),
                    },
                  ]}
                ></View>
              )}
            </View>
          );
        })}
      </View>
    );
  };
  const getDataSource = useCallback((list, type) => {
    // const data = list?.fillter((o) => o.type == type);
    const data = find(list, (o) => o.template_id == type);
    return data?.data;
  }, []);

  const getMenuSource = useCallback((list, type) => {
    const data = filter(list, (o) => o.template_id == type);
    return data;
  }, []);

  const bannerSource = useMemo(() => {
    return getDataSource(homeList, 'bg_carousel');
  }, [homeList]);

  const menuList = useMemo(() => {
    return getMenuSource(homeList, 'new_more_image');
  }, [homeList]);

  const adBanner = useMemo(() => {
    return getMenuSource(homeList, 'new_banner_1image');
  }, [homeList]);

  const footerTab = useMemo(() => {
    return getDataSource(homeList, 'new_goodstab');
  }, [homeList]);
  console.log(footerTab);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View
          style={{
            marginTop: sc375(-1),
          }}
        >
          <SearchBar
            placeholder="请输入想要搜索的商品"
            onChangeText={updateSearch}
            value={search}
            containerStyle={{
              backgroundColor: bannerSource?.[indictor]?.bg_color,
              borderColor: 'transparent',
            }}
            inputContainerStyle={{
              backgroundColor: 'rgb(245, 245, 245)',
            }}
          />
          {/* top navs */}
          <View
            style={{
              marginTop: sc375(-1),
            }}
          >
            {renderItem(titleList)}
          </View>
          {/*  banner */}
          <Banner
            dataSource={bannerSource}
            callback={(i) => setIndictor(i)}
            // defaultIndex={indictor}
          />
          {/* new_banner_lay */}
          <BannerLay dataSource={adBanner?.[0]?.data} />
        </View>
        {/* <Header /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        ></View>
        <MenuList menuSource={menuList}></MenuList>
        <ListBannerView key="list1" ListImgSource={adBanner?.[1]?.data} />
        <ListBannerView key="list2" ListImgSource={adBanner?.[2]?.data} />
        <View
          style={{
            width: sc375(375),
            height: sc375(137),
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <ImageBackground
            style={[
              styles.flex,
              styles.direction,
              {
                height: sc375(137),
                width: sc375(375),
              },
            ]}
            source={{ uri: menuList?.[2]?.img_url }}
          >
            {menuList?.[2]?.protocolList?.map((_, i) => {
              return (
                <Text
                  onPress={() => {
                    Linking.openURL(_.jump_url);
                  }}
                  key={i}
                  style={[styles.moreImgList]}
                ></Text>
              );
            })}
          </ImageBackground>
          {/* <Image
            style={{
              height: sc375(137),
              width: sc375(375),
            }}
            resizeMode="stretch"
            source={{
              uri: menuList?.[2]?.img_url,
            }}
          /> */}
        </View>
        <View>
          {footerTab?.data?.map((tab) => {
            return (
              <>
                <Text>{tab?.title}</Text>
                <Text>{tab?.subtitle}</Text>
              </>
            );
          })}
        </View>
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
    position: 'relative',
  },
  item: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'relative',
    flexDirection: 'column',
    paddingTop: sc375(5),
    display: 'flex',
  },
  direction: {
    flexDirection: 'row',
  },
  itemAct: {
    color: '#fff',
  },
  itemCurrent: {
    width: sc375(20),
    height: sc375(3),
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: sc375(2),
    left: sc375(10),
    zIndex: 1,
  },
  moreImgList: {
    flex: 1,
    height: sc375(137),
  },
});

export default App;
