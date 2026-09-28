import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const MoodSelector = ({ moodTypes, selectedMood, onSelectMood }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodList}
      >
        {moodTypes.map(mood => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodButton,
              { backgroundColor: mood.color },
              selectedMood === mood.id && styles.selectedMood,
            ]}
            onPress={() => onSelectMood(mood)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.label}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  moodList: {
    paddingHorizontal: 15,
  },
  moodButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedMood: {
    borderWidth: 3,
    borderColor: '#333',
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default MoodSelector;
