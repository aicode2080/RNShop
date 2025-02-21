import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { sc375 } from '../utils/screen';

interface BannerProps {
  dataSource: string[];
}

export const Banner = ({ dataSource }: BannerProps) => {
  console.log(dataSource, '=====dataSource');
  return dataSource ? (
    <Swiper showsButtons={true} loop={true} style={{ height: sc375(180) }}>
      {dataSource?.map((o: any, key) => {
        return (
          <View key={key} style={{ ...styles.flex, height: sc375(180) }}>
            <Image source={{ uri: o?.img_url }} style={{ flex: 1 }} />
          </View>
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
