import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default function MenuItem(props) {
  return (
    <TouchableOpacity
      onPress={() => props.selectItemFunction(props.game)}
      style={{
        flexDirection: 'row',
        minHeight: 60,
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
      }}>
      <View
        style={{
          backgroundColor: props.game.collected ? '#00ff00' : '#ff0000',
          flex: 1,
          minWidth: 40,
        }}
      />
      <View
        style={{
          flex: 4,
          backgroundColor: 'grey',
          justifyContent: 'center',
          paddingLeft: 10,
        }}>
        <Text>{props.game.name || ''}</Text>
      </View>
    </TouchableOpacity>
  );
}

export const MemoIzedMenuItem = React.memo(MenuItem);
