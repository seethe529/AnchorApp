import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { storage, STORAGE_KEYS } from '../utils/storage';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [moodData, setMoodData] = useState([]);
  const [techniqueData, setTechniqueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

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
    const techniqueCount = {};
    usage.forEach(entry => {
      techniqueCount[entry.technique] = (techniqueCount[entry.technique] || 0) + 1;
    });
    
    const chartData = Object.entries(techniqueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name: name.substring(0, 10), count }));
    
    setTechniqueData(chartData);
  };

  const chartConfig = {
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
  };

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
          <BarChart
            data={{
              labels: techniqueData.map(d => d.name),
              datasets: [{
                data: techniqueData.map(d => d.count)
              }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No technique usage data yet</Text>
            <Text style={styles.noDataSubtext}>Use techniques to see your patterns</Text>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Quick Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Mood Logs:</Text>
          <Text style={styles.statValue}>{moodData.filter(d => d.mood > 0).length}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Techniques Used:</Text>
          <Text style={styles.statValue}>{techniqueData.reduce((sum, d) => sum + d.count, 0)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Average Mood:</Text>
          <Text style={styles.statValue}>
            {moodData.length > 0 
              ? (moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.filter(d => d.mood > 0).length || 0).toFixed(1)
              : '0.0'
            }
          </Text>
        </View>
      </View>
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
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#2E8B57' }
});