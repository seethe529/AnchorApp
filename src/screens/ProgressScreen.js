import React, { useState, useEffect, useMemo, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { storage, STORAGE_KEYS } from '../utils/storage';

const screenWidth = Dimensions.get('window').width;

const QuickStats = memo(({ moodData, techniqueData }) => {
  const totalMoodLogs = useMemo(() => moodData.filter(d => d.mood > 0).length, [moodData]);
  const totalTechniques = useMemo(() => techniqueData.reduce((sum, d) => sum + d.count, 0), [techniqueData]);
  const avgMood = useMemo(() => {
    const validMoods = moodData.filter(d => d.mood > 0);
    return validMoods.length > 0
      ? (moodData.reduce((sum, d) => sum + d.mood, 0) / validMoods.length).toFixed(1)
      : '0.0';
  }, [moodData]);

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Quick Stats</Text>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Total Mood Logs:</Text>
        <Text style={styles.statValue}>{totalMoodLogs}</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Techniques Used:</Text>
        <Text style={styles.statValue}>{totalTechniques}</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Average Mood:</Text>
        <Text style={styles.statValue}>{avgMood}</Text>
      </View>
    </View>
  );
});


export default function ProgressScreen({ navigation }) {
  const [moodData, setMoodData] = useState([]);
  const [techniqueData, setTechniqueData] = useState([]);
  const [allRatedTechniques, setAllRatedTechniques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      const dateString = date.toDateString();
      
      const dayLogs = logs.filter(log => log.date === dateString);
      const avgMood = dayLogs.length > 0 
        ? dayLogs.reduce((sum, log) => sum + log.mood, 0) / dayLogs.length 
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
      techniqueStats[entry.technique].count++;
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
      .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness);
    
    setTechniqueData(chartData);
    setAllRatedTechniques(allRated);
  };

  const chartConfig = useMemo(() => ({
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(46, 139, 87, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#2E8B57'
    }
  }), []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading progress data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Mood Trend (Last 7 Days)</Text>
        {moodData.length > 0 && moodData.some(d => d.mood > 0) ? (
          <LineChart
            data={{
              labels: moodData.map(d => d.date.toString()),
              datasets: [{
                data: moodData.map(d => d.mood || 0)
              }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No mood data available yet</Text>
            <Text style={styles.noDataSubtext}>Start logging your mood to see trends</Text>
          </View>
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Most Used Techniques</Text>
        {techniqueData.length > 0 ? (
          <View>
            <BarChart
              data={{
                labels: techniqueData.map(d => d.name),
                datasets: [{
                  data: techniqueData.map(d => d.count)
                }]
              }}
              width={screenWidth - 70}
              height={220}
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={styles.chart}
            />
            {allRatedTechniques.length > 0 && (
              <View style={styles.effectivenessContainer}>
                <Text style={styles.effectivenessTitle}>Effectiveness Ratings:</Text>
                {allRatedTechniques.map((tech, idx) => (
                  <View key={idx} style={styles.effectivenessRow}>
                    <Text style={styles.effectivenessTechnique} numberOfLines={1} ellipsizeMode="tail">{tech.fullName}</Text>
                    <View style={styles.effectivenessBar}>
                      <View style={[styles.effectivenessFill, { width: `${(tech.avgEffectiveness / 5) * 100}%` }]} />
                      <Text style={styles.effectivenessScore}>{tech.avgEffectiveness}/5</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No technique usage data yet</Text>
            <Text style={styles.noDataSubtext}>Use techniques to see your patterns</Text>
          </View>
        )}
      </View>

      <QuickStats moodData={moodData} techniqueData={techniqueData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E8B57', textAlign: 'center', marginVertical: 20 },
  chartContainer: { backgroundColor: 'white', margin: 20, padding: 15, borderRadius: 10, elevation: 2 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  chart: { marginVertical: 8, borderRadius: 16 },
  noDataContainer: { alignItems: 'center', padding: 40 },
  noDataText: { fontSize: 16, fontWeight: '500', color: '#666', marginBottom: 5 },
  noDataSubtext: { fontSize: 14, color: '#999' },
  statsContainer: { backgroundColor: 'white', margin: 20, padding: 15, borderRadius: 10, elevation: 2 },
  statsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  statLabel: { fontSize: 16, color: '#666' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#2E8B57' },
  effectivenessContainer: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  effectivenessTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  effectivenessRow: { marginBottom: 12 },
  effectivenessTechnique: { fontSize: 14, color: '#666', marginBottom: 4, flexWrap: 'wrap' },
  effectivenessBar: { height: 24, backgroundColor: '#F0F0F0', borderRadius: 12, position: 'relative', justifyContent: 'center' },
  effectivenessFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#2E8B57', borderRadius: 12 },
  effectivenessScore: { fontSize: 12, fontWeight: 'bold', color: '#333', textAlign: 'center', zIndex: 1 }
});