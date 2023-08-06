import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import magIcon from '../mg icon.png';

export default function SearchTool(props) {
  const [searchBarExpanded, setSearchBarExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleToggleSearchBar = () => {
    setSearchBarExpanded(prevExpanded => !prevExpanded);
    setSearchText('');
    props.textChangedSetter('');
  };

  return (
    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
      {searchBarExpanded ? (
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            marginRight: 10,
            paddingHorizontal: 10,
            minWidth:100
          }}
          value={searchText}
          placeholder="useless placeholder"
          onChangeText={text => {
            setSearchText(text);
            props.textChangedSetter(text);
          }}
        />
      ) : null}
      <TouchableOpacity
        style={{justifyContent: 'flex-end'}}
        onPress={handleToggleSearchBar}>
        <Image source={magIcon} style={{width: 20, height: 20}} />
      </TouchableOpacity>
    </View>
  );
}
