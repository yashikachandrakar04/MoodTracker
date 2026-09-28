import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Line,
  Circle,
  Polyline,
  Text as SvgText,
} from 'react-native-svg';
import moment from 'moment';

const { width } = Dimensions.get('window');
const CHART_W = width - 80;
const CHART_H = 140;

const StatsView = ({ moodData, moodTypes, theme }) => {
  const stats = useMemo(() => {
    const last30 = [];
    for (let i = 29; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      if (moodData[date]) {
        last30.push({ date, value: moodData[date].value, ...moodData[date] });
      }
    }

    if (!last30.length) return null;

    const avg = last30.reduce((s, e) => s + e.value, 0) / last30.length;
    const counts = {};
    last30.forEach(e => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });

    // Best and worst mood days
    const best = last30.reduce((a, b) => (a.value > b.value ? a : b));
    const worst = last30.reduce((a, b) => (a.value < b.value ? a : b));

    // Streak
    let streak = 0;
    let d = moment();
    while (moodData[d.format('YYYY-MM-DD')]) {
      streak++;
      d = d.subtract(1, 'day');
    }

    return {
      last30,
      avg: avg.toFixed(1),
      counts,
      total: last30.length,
      streak,
      best,
      worst,
    };
  }, [moodData]);

  if (!stats) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyEmoji]}>📊</Text>
        <Text style={[styles.noData, { color: theme.text }]}>
          No mood data yet
        </Text>
        <Text style={[styles.noDataSub, { color: theme.subtext }]}>
          Start tracking to see insights
        </Text>
      </View>
    );
  }

  // Build chart points
  const maxVal = 6;
  const points = stats.last30.map((e, i) => {
    const x = (i / Math.max(stats.last30.length - 1, 1)) * CHART_W;
    const y = CHART_H - (e.value / maxVal) * CHART_H;
    return { x, y, color: e.color };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.container}>
      <View style={styles.cardsRow}>
        <StatCard icon="⭐" value={stats.avg} label="Avg Mood" theme={theme} />
        <StatCard
          icon="🔥"
          value={stats.streak}
          label="Day Streak"
          theme={theme}
        />
        <StatCard icon="📝" value={stats.total} label="Entries" theme={theme} />
      </View>

      <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>
          Last 30 Days Trend
        </Text>
        <Svg width={CHART_W} height={CHART_H + 20}>
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <Line
              key={i}
              x1={0}
              y1={t * CHART_H}
              x2={CHART_W}
              y2={t * CHART_H}
              stroke={theme.border}
              strokeWidth={0.5}
            />
          ))}
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={theme.chart}
            strokeWidth={2}
          />
          {points.map((p, i) => (
            <Circle key={i} cx={p.x} cy={p.y} r={3} fill={p.color} />
          ))}
        </Svg>
      </View>

      <View style={styles.cardsRow}>
        <HighlightCard
          title="Best Day"
          emoji={stats.best.emoji}
          date={moment(stats.best.date).format('MMM D')}
          color={stats.best.color}
          theme={theme}
        />
        <HighlightCard
          title="Lowest Day"
          emoji={stats.worst.emoji}
          date={moment(stats.worst.date).format('MMM D')}
          color={stats.worst.color}
          theme={theme}
        />
      </View>

      <View style={[styles.breakdown, { backgroundColor: theme.card }]}>
        <Text style={[styles.breakdownTitle, { color: theme.text }]}>
          Mood Distribution
        </Text>
        {moodTypes.map(mood => {
          const count = stats.counts[mood.id] || 0;
          const pct = stats.total ? (count / stats.total) * 100 : 0;
          return (
            <View key={mood.id} style={styles.moodRow}>
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <View style={{ flex: 1 }}>
                <View
                  style={[styles.bar, { backgroundColor: theme.secondary }]}
                >
                  <View
                    style={[
                      styles.barFill,
                      { width: `${pct}%`, backgroundColor: mood.color },
                    ]}
                  />
                </View>
              </View>
              <Text style={[styles.moodPct, { color: theme.subtext }]}>
                {count} ({pct.toFixed(0)}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const StatCard = ({ icon, value, label, theme }) => (
  <View style={[styles.statCard, { backgroundColor: theme.card }]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: theme.subtext }]}>{label}</Text>
  </View>
);

const HighlightCard = ({ title, emoji, date, color, theme }) => (
  <View style={[styles.highlightCard, { backgroundColor: color }]}>
    <Text style={styles.highlightTitle}>{title}</Text>
    <Text style={styles.highlightEmoji}>{emoji}</Text>
    <Text style={styles.highlightDate}>{date}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20 },
  emptyContainer: { padding: 60, alignItems: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 15 },
  noData: { fontSize: 18, fontWeight: '600' },
  noDataSub: { fontSize: 14, marginTop: 5 },
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
  },
  statIcon: { fontSize: 22, marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 11, marginTop: 3 },
  chartCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  chartTitle: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  highlightCard: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
  },
  highlightTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.9,
  },
  highlightEmoji: { fontSize: 32, marginVertical: 5 },
  highlightDate: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  breakdown: { borderRadius: 15, padding: 15, elevation: 2 },
  breakdownTitle: { fontSize: 15, fontWeight: '600', marginBottom: 15 },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  moodEmoji: { fontSize: 18 },
  bar: { height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  moodPct: { fontSize: 11, width: 65, textAlign: 'right' },
});

export default StatsView;
