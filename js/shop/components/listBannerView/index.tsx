import React from 'react';
import { View, Pressable, Image, Linking } from 'react-native';
import { sc375 } from '../../utils/screen';

interface ListBannerView {
  ListImgSource: any;
}
export const ListBannerView = (props) => {
  const { ListImgSource } = props;
  return (
    <React.Fragment>
      {ListImgSource?.map((o, i) => {
        return (
          <Pressable
            onPress={() => {
              Linking.openURL(o?.h5_url);
            }}
            key={o.img_url}
          >
            <View
              style={{
                width: sc375(375),
                // height: sc375(o.imageHeight),
                justifyContent: 'center',
              }}
            >
              <Image
                style={{
                  height: sc375(90),
                  // height: sc375(o.imageHeight),
                }}
                resizeMode="stretch"
                source={{
                  uri: o?.img_url,
                }}
              />
            </View>
          </Pressable>
        );
      })}
    </React.Fragment>
  );
};
