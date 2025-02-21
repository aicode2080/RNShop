import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { sc375 } from '../utils/screen';

interface BannerProps {
  dataSource: string[];
  callback?: (index: number) => void;
  defaultIndex?: number;
}

export const Banner = ({
  dataSource,
  callback,
  defaultIndex = 0,
}: BannerProps) => {
  // console.log(dataSource, '=====dataSource');
  return dataSource ? (
    <Swiper
      showsButtons={true}
      loop={true}
      // index={defaultIndex}
      onIndexChanged={(index) => callback?.(index)}
      style={{ height: sc375(180) }}
      autoplay
    >
      {dataSource?.map((o: any, key) => {
        return (
          <TouchableOpacity
            key={key}
            onPress={() => {
              Linking.openURL(o?.h5_url);
            }}
          >
            <View style={{ ...styles.flex, height: sc375(180) }}>
              <Image source={{ uri: o?.img_url }} style={{ flex: 1 }} />
            </View>
          </TouchableOpacity>
        );
      })}
    </Swiper>
  ) : null;
};

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
  },
  item: {
    flex: 1,
  },
  direction: {
    flexDirection: 'row',
  },
});
