import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import MoodGrid from './src/components/MoodGrid';
import MoodSelector from './src/components/MoodSelector';
import StatsView from './src/components/StatsView';
import NoteModal from './src/components/NoteModal';
import SearchBar from './src/components/SearchBar';
import ThemeToggle from './src/components/ThemeToggle';
import { lightTheme, darkTheme } from './src/theme/themes';
import { scheduleReminder } from './src/utils/notifications';
import { exportMoodData } from './src/utils/exportData';

type MoodEntry = {
  mood?: string;
  color?: string;
  emoji?: string;
  value?: number;
  note?: string;
  tags?: string[];
  timestamp?: string;
};

const App = () => {
  const [moodData, setMoodData] = useState<Record<string, MoodEntry>>({});
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [showStats, setShowStats] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState(null);
  const [streakAlert, setStreakAlert] = useState<string | null>(null);

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Enhanced mood types with gradients
  const moodTypes = [
    {
      id: 'terrible',
      color: '#8B0000',
      gradient: ['#8B0000', '#C41E3A'],
      emoji: '😢',
      label: 'Terrible',
      value: 1,
    },
    {
      id: 'bad',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FF8E8E'],
      emoji: '😔',
      label: 'Bad',
      value: 2,
    },
    {
      id: 'okay',
      color: '#FFD93D',
      gradient: ['#FFD93D', '#FFE66D'],
      emoji: '😐',
      label: 'Okay',
      value: 3,
    },
    {
      id: 'good',
      color: '#6BCB77',
      gradient: ['#6BCB77', '#8FD99A'],
      emoji: '🙂',
      label: 'Good',
      value: 4,
    },
    {
      id: 'great',
      color: '#4D96FF',
      gradient: ['#4D96FF', '#6BA6FF'],
      emoji: '😊',
      label: 'Great',
      value: 5,
    },
    {
      id: 'amazing',
      color: '#9D4EDD',
      gradient: ['#9D4EDD', '#C77DFF'],
      emoji: '🤩',
      label: 'Amazing',
      value: 6,
    },
  ];

  const allTags = [
    'work',
    'family',
    'health',
    'friends',
    'hobby',
    'sleep',
    'food',
    'exercise',
  ];

  useEffect(() => {
    loadAllData();
    scheduleReminder();
  }, []);

  const loadAllData = async () => {
    try {
      const [storedMood, storedTheme] = await Promise.all([
        AsyncStorage.getItem('moodData'),
        AsyncStorage.getItem('theme'),
      ]);
      if (storedMood) setMoodData(JSON.parse(storedMood));
      if (storedTheme) setIsDarkMode(storedTheme === 'dark');
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveMood = useCallback(
    async (
      moodType: { id: string; color: string; emoji: string; value: number },
      note: string = '',
      tags: string[] = [],
    ) => {
      const newData = {
        ...moodData,
        [selectedDate]: {
          mood: moodType.id,
          color: moodType.color,
          emoji: moodType.emoji,
          value: moodType.value,
          note,
          tags,
          timestamp: new Date().toISOString(),
        },
      };

      setMoodData(newData);
      checkStreak(newData);

      try {
        await AsyncStorage.setItem('moodData', JSON.stringify(newData));
      } catch (error) {
        Alert.alert('Error', 'Failed to save mood');
      }
    },
    [moodData, selectedDate],
  );

  const checkStreak = (data: Record<string, unknown>) => {
    let streak = 0;
    let date = moment();
    while (data[date.format('YYYY-MM-DD')]) {
      streak++;
      date = date.subtract(1, 'day');
    }
    if (streak > 0 && streak % 7 === 0) {
      setStreakAlert(`🔥 ${streak} day streak! Keep it up!`);
      setTimeout(() => setStreakAlert(null), 4000);
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const getCurrentMonthDates = () => {
    const startOfMonth = moment().startOf('month');
    const daysInMonth = startOfMonth.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) =>
      startOfMonth
        .clone()
        .date(i + 1)
        .format('YYYY-MM-DD'),
    );
  };

  const filteredMoodData = useCallback(() => {
    if (!searchQuery && !filterTag) return moodData;

    const filtered: typeof moodData = {};
    Object.entries(moodData).forEach(([date, entry]) => {
      const matchesSearch =
        !searchQuery ||
        entry.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.mood?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !filterTag || entry.tags?.includes(filterTag);

      if (matchesSearch && matchesTag) filtered[date] = entry;
    });
    return filtered;
  }, [moodData, searchQuery, filterTag]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {streakAlert && (
        <View style={[styles.streakBanner, { backgroundColor: theme.primary }]}>
          <Text style={styles.streakText}>{streakAlert}</Text>
        </View>
      )}

      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Mood Tracker</Text>
        <View style={styles.headerActions}>
          <ThemeToggle
            isDark={isDarkMode}
            onToggle={toggleTheme}
            theme={theme}
          />
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.primary }]}
            onPress={() => exportMoodData(moodData)}
          >
            <Text style={styles.iconText}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statsButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowStats(!showStats)}
          >
            <Text style={styles.statsButtonText}>
              {showStats ? '📅' : '📊'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {showStats ? (
          <StatsView moodData={moodData} moodTypes={moodTypes} theme={theme} />
        ) : (
          <>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              tags={allTags}
              selectedTag={filterTag}
              onTagSelect={setFilterTag}
              theme={theme}
            />

            <View style={styles.selectedDateContainer}>
              <Text style={[styles.selectedDateText, { color: theme.text }]}>
                {moment(selectedDate).format('dddd, MMMM D, YYYY')}
              </Text>
              {moodData[selectedDate] && (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={[styles.viewNote, { color: theme.primary }]}>
                    {moodData[selectedDate].note
                      ? '📝 View Note'
                      : '✏️ Add Note'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <MoodSelector
              moodTypes={moodTypes}
              selectedMood={moodData[selectedDate]?.mood}
              onSelectMood={(mood: (typeof moodTypes)[number]) => {
                saveMood(
                  mood,
                  moodData[selectedDate]?.note || '',
                  moodData[selectedDate]?.tags || [],
                );
                setModalVisible(true);
              }}
            />

            <MoodGrid
              dates={getCurrentMonthDates()}
              moodData={filteredMoodData()}
              selectedDate={selectedDate}
              onDatePress={setSelectedDate}
              theme={theme}
            />
          </>
        )}
      </ScrollView>

      <NoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialNote={moodData[selectedDate]?.note || ''}
        initialTags={moodData[selectedDate]?.tags || []}
        availableTags={allTags}
        onSave={(note: string, tags: string[]) => {
          const mood = moodTypes.find(
            m => m.id === moodData[selectedDate]?.mood,
          );
          if (mood) saveMood(mood, note, tags);
          setModalVisible(false);
        }}
        theme={theme}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: 'bold' },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 18 },
  statsButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statsButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  selectedDateContainer: { padding: 20, alignItems: 'center' },
  selectedDateText: { fontSize: 18, fontWeight: '600' },
  viewNote: { fontSize: 13, marginTop: 5, fontWeight: '500' },
  streakBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 12,
    alignItems: 'center',
  },
  streakText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});

export default App;
