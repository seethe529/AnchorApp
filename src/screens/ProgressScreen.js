import React, { useState, useEffect, useMemo, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const QuickStats = memo(({ moodData, techniqueData, allMoodLogs, theme }) => {
  const totalMoodLogs = useMemo(() => allMoodLogs?.length || 0, [allMoodLogs]);
  const totalTechniques = useMemo(() => techniqueData.reduce((sum, d) => sum + d.count, 0), [techniqueData]);

  return (
    <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
      <Text style={[styles.statsTitle, { color: theme.text }]}>Quick Stats</Text>
      <View style={styles.statRow}>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Times you checked in:</Text>
        <Text style={[styles.statValue, { color: theme.primary }]}>{totalMoodLogs}</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Support Moments:</Text>
        <Text style={[styles.statValue, { color: theme.primary }]}>{totalTechniques}</Text>
      </View>
    </View>
  );
});


export default function ProgressScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [moodData, setMoodData] = useState([]);
  const [techniqueData, setTechniqueData] = useState([]);
  const [allRatedTechniques, setAllRatedTechniques] = useState([]);
  const [allMoodLogs, setAllMoodLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showViewCounts, setShowViewCounts] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProgressData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProgressData = async () => {
    try {
      const moodLogs = await storage.getItem(STORAGE_KEYS.MOOD_LOGS) || [];
      const techniqueUsage = await storage.getItem(STORAGE_KEYS.TECHNIQUE_USAGE) || [];
      
      setAllMoodLogs(moodLogs);
      processMoodData(moodLogs);
      processTechniqueData(techniqueUsage);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processMoodData = (logs) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      const dayLogs = logs.filter(log => log.date === dateString);
      const avgMood = dayLogs.length > 0 
        ? dayLogs.reduce((sum, log) => {
            // Handle both quick logs (mood field) and detailed logs (valence field)
            return sum + (log.mood || log.valence || 0);
          }, 0) / dayLogs.length 
        : 0;
      
      last7Days.push({
        date: date.getDate(),
        mood: avgMood
      });
    }
    
    setMoodData(last7Days);
  };

  const processTechniqueData = (usage) => {
    const techniqueStats = {};
    
    usage.forEach(entry => {
      if (!techniqueStats[entry.technique]) {
        techniqueStats[entry.technique] = { count: 0, totalEffectiveness: 0, ratings: 0 };
      }
      // Only count views (entries without effectiveness) for "Go-To" chart
      if (!entry.effectiveness) {
        techniqueStats[entry.technique].count++;
      }
      // Track ratings separately for "What's Working Best"
      if (entry.effectiveness) {
        techniqueStats[entry.technique].totalEffectiveness += entry.effectiveness;
        techniqueStats[entry.technique].ratings++;
      }
    });
    
    const chartData = Object.entries(techniqueStats)
      .map(([name, stats]) => ({
        name: name.substring(0, 10),
        fullName: name,
        count: stats.count,
        avgEffectiveness: stats.ratings > 0 ? (stats.totalEffectiveness / stats.ratings).toFixed(1) : null
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const allRated = Object.entries(techniqueStats)
      .filter(([name, stats]) => stats.ratings > 0)
      .map(([name, stats]) => ({
        fullName: name,
        avgEffectiveness: (stats.totalEffectiveness / stats.ratings).toFixed(1)
      }))
      .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)
      .slice(0, 5);
    
    setTechniqueData(chartData);
    setAllRatedTechniques(allRated);
  };

  const chartConfig = useMemo(() => ({
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(46, 139, 87, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.primary
    }
  }), [theme, isDark]);

   if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading progress data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text style={[styles.title, { color: theme.primary }]}>Your Progress</Text>
      
      <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>Mood Trend (Last 7 Days)</Text>
        {moodData.length > 0 && moodData.some(d => d.mood > 0) ? (
          <LineChart
            data={{
              labels: moodData.map(d => d.date.toString()),
              datasets: [{
                data: moodData.map(d => d.mood || 0)
              }]
            }}
            width={screenWidth - 70}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={[styles.noDataText, { color: theme.textSecondary }]}>No mood data available yet</Text>
            <Text style={[styles.noDataSubtext, { color: theme.textTertiary }]}>Start logging your mood to see trends</Text>
          </View>
        )}
      </View>

      <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Your Go-To Techniques</Text>
          <TouchableOpacity 
            onPress={() => setShowViewCounts(!showViewCounts)}
            style={[styles.toggleButton, { backgroundColor: theme.background }]}
            accessibilityLabel={showViewCounts ? "Hide view counts" : "Show view counts"}
            accessibilityRole="switch"
            accessibilityState={{ checked: showViewCounts }}
          >
            <Ionicons name={showViewCounts ? "eye" : "eye-off"} size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
        {techniqueData.length > 0 ? (
          <View>
            {techniqueData.map((tech, idx) => {
              const maxCount = Math.max(...techniqueData.map(t => t.count));
              const percentage = (tech.count / maxCount) * 100;
              return (
                <View key={idx} style={styles.techniqueUsageRow}>
                  <Text style={[styles.techniqueUsageName, { color: theme.textSecondary }]} numberOfLines={1}>
                    {tech.fullName}
                  </Text>
                  <View style={[styles.techniqueUsageBar, { backgroundColor: theme.background }]}>
                    <View style={[styles.techniqueUsageFill, { width: `${percentage}%`, backgroundColor: theme.primary }]} />
                    {showViewCounts && (
                      <Text style={[styles.viewCountText, { color: theme.text }]}>{tech.count} views</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={[styles.noDataText, { color: theme.textSecondary }]}>No technique usage data yet</Text>
            <Text style={[styles.noDataSubtext, { color: theme.textTertiary }]}>Use techniques to see your patterns</Text>
          </View>
        )}
      </View>

      {allRatedTechniques.length > 0 && (
        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>What's Felt Most Helpful</Text>
          {allRatedTechniques.map((tech, idx) => {
            const getQualitativeLabel = (score) => {
              if (score >= 4.5) return 'Very Helpful';
              if (score >= 3.5) return 'Helpful';
              if (score >= 2.5) return 'Somewhat Helpful';
              return 'Needs Practice';
            };
            return (
              <View key={idx} style={styles.effectivenessRow}>
                <Text style={[styles.effectivenessTechnique, { color: theme.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">{tech.fullName}</Text>
                <View style={[styles.effectivenessBar, { backgroundColor: theme.background }]}>
                  <View style={[styles.effectivenessFill, { width: `${(tech.avgEffectiveness / 5) * 100}%`, backgroundColor: theme.primary }]} />
                  <Text style={[styles.effectivenessScore, { color: theme.text }]}>{getQualitativeLabel(parseFloat(tech.avgEffectiveness))}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <QuickStats moodData={moodData} techniqueData={techniqueData} allMoodLogs={allMoodLogs} theme={theme} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  chartContainer: { margin: 20, padding: 15, borderRadius: 10, elevation: 2 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  toggleButton: { padding: 8, borderRadius: 8 },
  chart: { marginVertical: 8, borderRadius: 16 },
  noDataContainer: { alignItems: 'center', padding: 40 },
  noDataText: { fontSize: 16, fontWeight: '500', marginBottom: 5 },
  noDataSubtext: { fontSize: 14 },
  statsContainer: { margin: 20, padding: 15, borderRadius: 10, elevation: 2 },
  statsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  statLabel: { fontSize: 16 },
  statValue: { fontSize: 16, fontWeight: 'bold' },
  effectivenessRow: { marginBottom: 12 },
  effectivenessTechnique: { fontSize: 14, marginBottom: 4, flexWrap: 'wrap' },
  effectivenessBar: { height: 28, borderRadius: 14, position: 'relative', justifyContent: 'center' },
  effectivenessFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 14 },
  effectivenessScore: { fontSize: 13, fontWeight: '600', textAlign: 'center', zIndex: 1 },
  techniqueUsageRow: { marginBottom: 16 },
  techniqueUsageName: { fontSize: 14, marginBottom: 6, fontWeight: '500' },
  techniqueUsageBar: { height: 32, borderRadius: 16, position: 'relative', justifyContent: 'center' },
  techniqueUsageFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 16 },
  viewCountText: { fontSize: 12, fontWeight: '500', textAlign: 'center', zIndex: 1 }
});