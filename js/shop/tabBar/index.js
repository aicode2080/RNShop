import React, { useState } from 'react';
import {
  Image,
  StyleProp,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
} from 'react-native';
import { View } from 'react-native-animatable';
import { FastImage } from 'react-native-fast-image';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const sc375 = (layout) => layout * (width / 375);
const sc = sc375;

const icons = [
  {
    title: '首页',
    selected: require('../asserts/tabBar/tab_newtab02.png'),
    unSelect: require('../asserts/tabBar/tab_newtab01.png'),
  },
  {
    title: '分类',
    selected: require('../asserts/tabBar/tab_category_pressed.png'),
    unSelect: require('../asserts/tabBar/tab_category.png'),
  },
  {
    title: '友阿购物卡',
    selected: require('../asserts/tabBar/0b.png'),
    unSelect: require('../asserts/tabBar/0a.png'),
  },
  {
    title: '购物车',
    selected: require('../asserts/tabBar/tab_newtab04.png'),
    unSelect: require('../asserts/tabBar/tab_newtab03.png'),
  },
  {
    title: '我的',
    selected: require('../asserts/tabBar/tab_newtab06.png'),
    unSelect: require('../asserts/tabBar/tab_newtab05.png'),
  },
];

export const ShopTab = (p) => {
  const { selectedIndex } = p;
  const [selectIndex, setSelectIndex] = useState(selectedIndex);
  console.log(icons);
  const items = icons?.map((ele, idx) => {
    const { title, selected, unSelect } = ele;
    const uri = selectIndex == idx ? selected : unSelect;
    return (
      <TouchableWithoutFeedback
        key={title}
        onPress={() => {
          //使用其它 Touchable 按钮安卓要出问题
          console.log(idx);
          setSelectIndex(idx);
        }}
      >
        <View style={{ alignItems: 'center', flex: 1, height: sc(44) }}>
          <Image
            style={{ width: sc(24), height: sc(24) }}
            source={uri}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: sc(7),
              marginTop: sc(7),
              color: selectIndex == idx ? 'rgb(124, 27, 255)' : '#000',
            }}
          >
            {title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });
  return (
    <View
      style={[
        {
          position: 'absolute',
          left: 0,
          bottom: 0,
          flexDirection: 'row',
          backgroundColor: '#fff',
          paddingTop: sc(6),
        },
      ]}
    >
      {items}
    </View>
  );
};
