import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { citations, generalResources, disclaimer, formatCitation } from '../data/citations';

export default function ResourcesScreen() {
  const openURL = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resources & Citations</Text>
      
      <View style={styles.disclaimerBox}>
        <Ionicons name="information-circle" size={24} color="#2E8B57" />
        <View style={styles.disclaimerContent}>
          <Text style={styles.disclaimerTitle}>{disclaimer.title}</Text>
          <Text style={styles.disclaimerText}>{disclaimer.content}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evidence-Based Approaches</Text>
        <Text style={styles.sectionDescription}>
          All techniques in this app are based on the following evidence-based therapeutic approaches:
        </Text>

        <View style={styles.citationCard}>
          <Text style={styles.citationTitle}>{citations.dbt.title}</Text>
          <Text style={styles.citationText}>{formatCitation(citations.dbt)}</Text>
          <Text style={styles.citationDescription}>{citations.dbt.description}</Text>
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openURL(citations.dbt.url)}
            accessibilityLabel="Learn more about DBT"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Learn More</Text>
            <Ionicons name="open-outline" size={16} color="#2E8B57" />
          </TouchableOpacity>
        </View>

        <View style={styles.citationCard}>
          <Text style={styles.citationTitle}>{citations.cbt.title}</Text>
          <Text style={styles.citationText}>{formatCitation(citations.cbt)}</Text>
          <Text style={styles.citationDescription}>{citations.cbt.description}</Text>
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openURL(citations.cbt.url)}
            accessibilityLabel="Learn more about CBT"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Learn More</Text>
            <Ionicons name="open-outline" size={16} color="#2E8B57" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technique-Specific Citations</Text>

        <View style={styles.citationCard}>
          <Text style={styles.citationTitle}>{citations.grounding.title}</Text>
          <Text style={styles.citationText}>{formatCitation(citations.grounding)}</Text>
          <Text style={styles.citationDescription}>{citations.grounding.description}</Text>
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openURL(citations.grounding.url)}
            accessibilityLabel="Learn more about grounding techniques"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>View Source</Text>
            <Ionicons name="open-outline" size={16} color="#2E8B57" />
          </TouchableOpacity>
        </View>

        <View style={styles.citationCard}>
          <Text style={styles.citationTitle}>{citations.breathing.title}</Text>
          <Text style={styles.citationText}>{formatCitation(citations.breathing)}</Text>
          <Text style={styles.citationDescription}>{citations.breathing.description}</Text>
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openURL(citations.breathing.url)}
            accessibilityLabel="Learn more about breathing techniques"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>View Source</Text>
            <Ionicons name="open-outline" size={16} color="#2E8B57" />
          </TouchableOpacity>
        </View>

        <View style={styles.citationCard}>
          <Text style={styles.citationTitle}>{citations.mindfulness.title}</Text>
          <Text style={styles.citationText}>{formatCitation(citations.mindfulness)}</Text>
          <Text style={styles.citationDescription}>{citations.mindfulness.description}</Text>
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openURL(citations.mindfulness.url)}
            accessibilityLabel="Learn more about mindfulness"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>View Source</Text>
            <Ionicons name="open-outline" size={16} color="#2E8B57" />
          </TouchableOpacity>
        </View>

        <View style={styles.citationCard}>
          <Text style={styles.citationTitle}>{citations.tipp.title}</Text>
          <Text style={styles.citationText}>{formatCitation(citations.tipp)}</Text>
          <Text style={styles.citationDescription}>{citations.tipp.description}</Text>
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openURL(citations.tipp.url)}
            accessibilityLabel="Learn more about DBT skills"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>View Source</Text>
            <Ionicons name="open-outline" size={16} color="#2E8B57" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Resources</Text>
        
        {generalResources.map((resource, index) => (
          <View key={index} style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.resourceOrg}>{resource.organization}</Text>
            <Text style={styles.resourceDescription}>{resource.description}</Text>
            {resource.phone && (
              <Text style={styles.resourcePhone}>Phone: {resource.phone}</Text>
            )}
            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => openURL(resource.url)}
              accessibilityLabel={`Visit ${resource.title}`}
              accessibilityRole="button"
            >
              <Text style={styles.linkText}>Visit Website</Text>
              <Ionicons name="open-outline" size={16} color="#2E8B57" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All techniques and recommendations in this app are based on peer-reviewed research and clinical guidelines. 
          For professional treatment, please consult a licensed mental health provider.
        </Text>
        <Text style={styles.footerDate}>Last Updated: {disclaimer.lastUpdated}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E8B57', textAlign: 'center', marginVertical: 20 },
  disclaimerBox: { 
    flexDirection: 'row', 
    backgroundColor: '#E8F5E8', 
    padding: 15, 
    margin: 15, 
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57'
  },
  disclaimerContent: { flex: 1, marginLeft: 10 },
  disclaimerTitle: { fontSize: 16, fontWeight: 'bold', color: '#2E8B57', marginBottom: 5 },
  disclaimerText: { fontSize: 14, color: '#333', lineHeight: 20 },
  section: { padding: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  sectionDescription: { fontSize: 14, color: '#666', marginBottom: 15, lineHeight: 20 },
  citationCard: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15,
    elevation: 2
  },
  citationTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  citationText: { fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 8 },
  citationDescription: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 10 },
  linkButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  linkText: { fontSize: 14, color: '#2E8B57', fontWeight: '500', marginRight: 5 },
  resourceCard: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15,
    elevation: 1
  },
  resourceTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 3 },
  resourceOrg: { fontSize: 14, color: '#2E8B57', marginBottom: 8 },
  resourceDescription: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 8 },
  resourcePhone: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  footer: { 
    backgroundColor: '#E8F5E8', 
    padding: 20, 
    margin: 15, 
    borderRadius: 10,
    marginBottom: 30
  },
  footerText: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 10 },
  footerDate: { fontSize: 12, color: '#666', fontStyle: 'italic' }
});
