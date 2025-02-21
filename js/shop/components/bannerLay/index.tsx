import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Linking,
  Pressable,
} from 'react-native';
import { sc375 } from '../../utils/screen';

type laySource = {
  img_url: string;
  h5_url: string;
};

interface bannerLayProps {
  dataSource: laySource[];
}

export const BannerLay = ({ dataSource }: bannerLayProps) => {
  return dataSource
    ? dataSource
        .filter((o) => o?.img_url)
        ?.map((o, key) => {
          return (
            <Pressable
              key={key}
              onPress={() => {
                Linking.openURL(o?.h5_url);
              }}
            >
              <View
                key={o.img_url}
                style={{
                  ...styles.flex,
                  ...styles.direction,
                  height: sc375(30),
                }}
              >
                <Image
                  resizeMode="contain"
                  source={{ uri: o?.img_url }}
                  style={styles.item}
                />
              </View>
            </Pressable>
          );
        })
    : null;
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
