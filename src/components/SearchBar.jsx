import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

const SearchBar = ({
  value,
  onChangeText,
  tags,
  selectedTag,
  onTagSelect,
  theme,
}) => (
  <View style={styles.container}>
    <View style={[styles.searchBox, { backgroundColor: theme.card }]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="Search notes or moods..."
        placeholderTextColor={theme.subtext}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text style={{ color: theme.subtext, fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tagsRow}
    >
      {tags.map(tag => (
        <TouchableOpacity
          key={tag}
          style={[
            styles.tag,
            {
              backgroundColor: selectedTag === tag ? theme.primary : theme.card,
            },
          ]}
          onPress={() => onTagSelect(selectedTag === tag ? null : tag)}
        >
          <Text
            style={{
              color: selectedTag === tag ? '#FFF' : theme.subtext,
              fontSize: 12,
              fontWeight: '500',
            }}
          >
            #{tag}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, fontSize: 15, padding: 0 },
  tagsRow: { gap: 8, paddingVertical: 10 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
});

export default SearchBar;
