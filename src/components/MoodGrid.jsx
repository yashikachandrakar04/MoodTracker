import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import moment from 'moment';

const { width } = Dimensions.get('window');
const PADDING = 20;
const ITEM_SIZE = (width - PADDING * 2) / 7;

const AnimatedCell = ({ children, delay, ...props }) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      delay,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity {...props}>{children}</TouchableOpacity>
    </Animated.View>
  );
};

const MoodGrid = ({ dates, moodData, selectedDate, onDatePress, theme }) => {
  const getColor = date => moodData[date]?.color || theme.secondary;

  const renderGrid = () => {
    const weeks = [];
    let week = [];
    const firstDay = moment(dates[0]).day();

    for (let i = 0; i < firstDay; i++) {
      week.push(<View key={`e-${i}`} style={styles.emptyItem} />);
    }

    dates.forEach((date, index) => {
      const dayOfWeek = moment(date).day();
      const entry = moodData[date];
      const isToday = date === moment().format('YYYY-MM-DD');

      week.push(
        <AnimatedCell
          key={date}
          delay={index * 15}
          style={[
            styles.gridItem,
            { backgroundColor: getColor(date) },
            selectedDate === date && styles.selected,
            isToday && { borderWidth: 2, borderColor: theme.primary },
          ]}
          onPress={() => onDatePress(date)}
          activeOpacity={0.7}
        >
          <Text style={styles.dayText}>{moment(date).date()}</Text>
          {entry?.emoji ? (
            <Text style={styles.emoji}>{entry.emoji}</Text>
          ) : null}
          {entry?.note ? <View style={styles.noteDot} /> : null}
        </AnimatedCell>,
      );

      if (dayOfWeek === 6 || index === dates.length - 1) {
        for (let i = 0; i < 6 - dayOfWeek; i++) {
          week.push(
            <View key={`end-${index}-${i}`} style={styles.emptyItem} />,
          );
        }
        weeks.push(
          <View key={`w-${weeks.length}`} style={styles.week}>
            {week}
          </View>,
        );
        week = [];
      }
    });

    return weeks;
  };

  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        <Text style={[styles.legendTitle, { color: theme.text }]}>
          {moment(dates[0]).format('MMMM YYYY')}
        </Text>
      </View>

      <View style={styles.weekDays}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <View key={i} style={styles.weekDayItem}>
            <Text style={[styles.weekDayText, { color: theme.subtext }]}>
              {d}
            </Text>
          </View>
        ))}
      </View>

      <View>{renderGrid()}</View>

      <View style={styles.noteLegend}>
        <View style={styles.noteDotLegend} />
        <Text style={[styles.noteLegendText, { color: theme.subtext }]}>
          Has note
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: PADDING },
  legend: { alignItems: 'center', marginBottom: 15 },
  legendTitle: { fontSize: 18, fontWeight: 'bold' },
  weekDays: { flexDirection: 'row', marginBottom: 8 },
  weekDayItem: { width: ITEM_SIZE, alignItems: 'center' },
  weekDayText: { fontSize: 12, fontWeight: '600' },
  week: { flexDirection: 'row', marginBottom: 4 },
  gridItem: {
    width: ITEM_SIZE - 4,
    height: ITEM_SIZE - 4,
    margin: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  emptyItem: {
    width: ITEM_SIZE - 4,
    height: ITEM_SIZE - 4,
    margin: 2,
  },
  selected: { borderWidth: 3, borderColor: '#1C1C1E' },
  dayText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  emoji: { fontSize: 13, marginTop: 1 },
  noteDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  noteLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  noteDotLegend: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4D96FF',
  },
  noteLegendText: { fontSize: 11 },
});

export default MoodGrid;
