import React from 'react';
import { View, StyleSheet, ImageBackground, Text, Linking } from 'react-native';
import { sc375 } from '../../utils/screen';

interface MenuListProps {
  menuSource: any;
}
export const MenuList = (props: MenuListProps) => {
  const { menuSource } = props;
  return (
    <View style={[styles.menuContainer]}>
      <ImageBackground
        style={{
          height: sc375(85),
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}
        source={{
          uri: menuSource[0]?.img_url,
        }}
      >
        {menuSource[0]?.protocolList?.map((o: any, key) => {
          return (
            <View
              key={key}
              style={{
                flex: 1,
              }}
            >
              <Text
                style={[styles.menuList]}
                onPress={() => {
                  Linking.openURL(o?.jump_url).catch((err) =>
                    console.error(err),
                  );
                }}
              >
                {/* 金刚位 */}
              </Text>
            </View>
          );
        })}
      </ImageBackground>
      <ImageBackground
        style={{
          height: sc375(85),
          display: 'flex',
          flexDirection: 'row',
        }}
        resizeMode='contain'
        source={{
          uri: menuSource[1]?.img_url,
        }}
      >
        {menuSource[1]?.protocolList?.map((o: any, key) => {
          return (
            <View
              key={key}
              style={{
                flex: 1,
              }}
            >
              <Text
                style={[styles.menuList]}
                onPress={() => {
                  Linking.openURL(o?.jump_url).catch((err) =>
                    console.error(err),
                  );
                }}
              >
                {/* 金刚位 */}
              </Text>
            </View>
          );
        })}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    display: 'flex',
    alignItemsc: 'center',
    marginBottom: sc375(10),
  },
  menuList: {
    flex: 1,
    textAlign: 'center',
  },
});
