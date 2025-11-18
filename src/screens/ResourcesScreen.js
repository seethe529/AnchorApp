import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { citations, generalResources, disclaimer, formatCitation } from '../data/citations';
import { useTheme } from '../context/ThemeContext';

export default function ResourcesScreen() {
  const { theme } = useTheme();
  const openURL = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary }]}>Resources & Citations</Text>
      
      <View style={[styles.disclaimerBox, { backgroundColor: theme.primary + '20', borderLeftColor: theme.primary }]}>
        <Ionicons name="information-circle" size={24} color={theme.primary} />
        <View style={styles.disclaimerContent}>
          <Text style={[styles.disclaimerTitle, { color: theme.primary }]}>{disclaimer.title}</Text>
          <Text style={[styles.disclaimerText, { color: theme.text }]}>{disclaimer.content}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Evidence-Based Approaches</Text>
        <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
          All techniques in this app are based on the following evidence-based therapeutic approaches:
        </Text>

        <View style={[styles.citationCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.citationTitle, { color: theme.text }]}>{citations.dbt.title}</Text>
          <Text style={[styles.citationText, { color: theme.textSecondary }]}>{formatCitation(citations.dbt)}</Text>
          <Text style={[styles.citationDescription, { color: theme.textSecondary }]}>{citations.dbt.description}</Text>
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.primary + '20' }]} 
            onPress={() => openURL(citations.dbt.url)}
            accessibilityLabel="Learn more about DBT"
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: theme.primary }]}>Learn More</Text>
            <Ionicons name="open-outline" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.citationCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.citationTitle, { color: theme.text }]}>{citations.cbt.title}</Text>
          <Text style={[styles.citationText, { color: theme.textSecondary }]}>{formatCitation(citations.cbt)}</Text>
          <Text style={[styles.citationDescription, { color: theme.textSecondary }]}>{citations.cbt.description}</Text>
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.primary + '20' }]} 
            onPress={() => openURL(citations.cbt.url)}
            accessibilityLabel="Learn more about CBT"
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: theme.primary }]}>Learn More</Text>
            <Ionicons name="open-outline" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Technique-Specific Citations</Text>

        <View style={[styles.citationCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.citationTitle, { color: theme.text }]}>{citations.grounding.title}</Text>
          <Text style={[styles.citationText, { color: theme.textSecondary }]}>{formatCitation(citations.grounding)}</Text>
          <Text style={[styles.citationDescription, { color: theme.textSecondary }]}>{citations.grounding.description}</Text>
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.primary + '20' }]} 
            onPress={() => openURL(citations.grounding.url)}
            accessibilityLabel="Learn more about grounding techniques"
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: theme.primary }]}>View Source</Text>
            <Ionicons name="open-outline" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.citationCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.citationTitle, { color: theme.text }]}>{citations.breathing.title}</Text>
          <Text style={[styles.citationText, { color: theme.textSecondary }]}>{formatCitation(citations.breathing)}</Text>
          <Text style={[styles.citationDescription, { color: theme.textSecondary }]}>{citations.breathing.description}</Text>
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.primary + '20' }]} 
            onPress={() => openURL(citations.breathing.url)}
            accessibilityLabel="Learn more about breathing techniques"
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: theme.primary }]}>View Source</Text>
            <Ionicons name="open-outline" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.citationCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.citationTitle, { color: theme.text }]}>{citations.mindfulness.title}</Text>
          <Text style={[styles.citationText, { color: theme.textSecondary }]}>{formatCitation(citations.mindfulness)}</Text>
          <Text style={[styles.citationDescription, { color: theme.textSecondary }]}>{citations.mindfulness.description}</Text>
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.primary + '20' }]} 
            onPress={() => openURL(citations.mindfulness.url)}
            accessibilityLabel="Learn more about mindfulness"
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: theme.primary }]}>View Source</Text>
            <Ionicons name="open-outline" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.citationCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.citationTitle, { color: theme.text }]}>{citations.tipp.title}</Text>
          <Text style={[styles.citationText, { color: theme.textSecondary }]}>{formatCitation(citations.tipp)}</Text>
          <Text style={[styles.citationDescription, { color: theme.textSecondary }]}>{citations.tipp.description}</Text>
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.primary + '20' }]} 
            onPress={() => openURL(citations.tipp.url)}
            accessibilityLabel="Learn more about DBT skills"
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: theme.primary }]}>View Source</Text>
            <Ionicons name="open-outline" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Additional Resources</Text>
        
        {generalResources.map((resource, index) => (
          <View key={index} style={[styles.resourceCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.resourceTitle, { color: theme.text }]}>{resource.title}</Text>
            <Text style={[styles.resourceOrg, { color: theme.primary }]}>{resource.organization}</Text>
            <Text style={[styles.resourceDescription, { color: theme.textSecondary }]}>{resource.description}</Text>
            {resource.phone && (
              <Text style={[styles.resourcePhone, { color: theme.textSecondary }]}>Phone: {resource.phone}</Text>
            )}
            <TouchableOpacity 
              style={[styles.linkButton, { backgroundColor: theme.primary + '20' }]} 
              onPress={() => openURL(resource.url)}
              accessibilityLabel={`Visit ${resource.title}`}
              accessibilityRole="button"
            >
              <Text style={[styles.linkText, { color: theme.primary }]}>Visit Website</Text>
              <Ionicons name="open-outline" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.footer, { backgroundColor: theme.primary + '20' }]}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          All techniques and recommendations in this app are based on peer-reviewed research and clinical guidelines. 
          For professional treatment, please consult a licensed mental health provider.
        </Text>
        <Text style={[styles.footerDate, { color: theme.textSecondary }]}>Last Updated: {disclaimer.lastUpdated}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  disclaimerBox: { 
    flexDirection: 'row', 
    padding: 15, 
    margin: 15, 
    borderRadius: 10,
    borderLeftWidth: 4
  },
  disclaimerContent: { flex: 1, marginLeft: 10 },
  disclaimerTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  disclaimerText: { fontSize: 14, lineHeight: 20 },
  section: { padding: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  sectionDescription: { fontSize: 14, marginBottom: 15, lineHeight: 20 },
  citationCard: { 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15,
    elevation: 2
  },
  citationTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  citationText: { fontSize: 13, fontStyle: 'italic', marginBottom: 8 },
  citationDescription: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  linkButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  linkText: { fontSize: 14, fontWeight: '500', marginRight: 5 },
  resourceCard: { 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15,
    elevation: 1
  },
  resourceTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 3 },
  resourceOrg: { fontSize: 14, marginBottom: 8 },
  resourceDescription: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  resourcePhone: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  footer: { 
    padding: 20, 
    margin: 15, 
    borderRadius: 10,
    marginBottom: 30
  },
  footerText: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  footerDate: { fontSize: 12, fontStyle: 'italic' }
});
