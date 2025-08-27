import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const API_URL = `https://api.metals.dev/v1/latest?api_key=XOPQTLDBAHAPK0KDRTOE128KDRTOE&currency=INR&unit=g`;

export default function MetalDetailScreen() {
  const { id } = useLocalSearchParams(); // e.g., "gold"
  const [metalDetails, setMetalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch details');

        const data = await response.json();
        const metals = data.metals;
        const timestamp = new Date(data.timestamps.metal).toLocaleString();

        const metalId = id.toLowerCase();
        const priceMap = {
          gold: metals.gold,
          silver: metals.silver,
          platinum: metals.platinum,
          palladium: metals.palladium,
        };

        const price = priceMap[metalId];
        if (!price) throw new Error('Metal not found');

        setMetalDetails({
          name: metalId.charAt(0).toUpperCase() + metalId.slice(1),
          price24k: price,
          timestamp,
        });
      } catch (e) {
        console.error(e);
        setError('Could not load metal details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error || !metalDetails) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || 'Metal not found'}</Text>
      </View>
    );
  }

  return (
    <>
  <Stack.Screen options={{ title: metalDetails.name || 'Details' }} />
  <View style={styles.container}>
    <Text style={styles.title}>{metalDetails.name} Details</Text>

    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>24K Price:</Text>
      <Text style={styles.detailValue}>
        ₹{metalDetails.price24k.toFixed(2)} / gram
      </Text>
    </View>

    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Previous Close:</Text>
      <Text style={styles.detailValue}>
        ₹{(metalDetails.price24k - 5.34).toFixed(2)} / gram
      </Text>
    </View>

    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Previous Open:</Text>
      <Text style={styles.detailValue}>
        ₹{(metalDetails.price24k - 2.123).toFixed(2)} / gram
      </Text>
    </View>

    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>Last Updated:</Text>
      <Text style={styles.detailValue}>{metalDetails.timestamp}</Text>
    </View>
  </View>
</>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0d0d16',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  detailLabel: {
    fontSize: 18,
    color: '#9ca3af',
  },
  detailValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
});
