import MetalCard from '@/components/MetalCard';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Animated,
} from 'react-native';

const API_URL =
  'https://api.metals.dev/v1/latest?api_key=XOPQTLDBAHAPK0KDRTOE128KDRTOE&currency=INR&unit=g';

const TITLE_MAX_SIZE = 34;
const TITLE_MIN_SIZE = 20;

export default function HomeScreen() {
  const [symbols, setSymbols] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchPrices = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch metal prices');
      const data = await response.json();

      const metals = data.metals;
      const timestamp = new Date(data.timestamps.metal).getTime() / 1000;

      const formatted = [
        { metal: 'gold', price: metals.gold, timestamp },
        { metal: 'silver', price: metals.silver, timestamp },
        { metal: 'platinum', price: metals.platinum, timestamp },
        { metal: 'palladium', price: metals.palladium, timestamp },
      ];

      setSymbols(formatted);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Could not connect to Metals.dev.');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPrices();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPrices();
  }, []);

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Animate title
  const titleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [TITLE_MAX_SIZE, TITLE_MIN_SIZE],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFD700']}
          />
        }
      >
        <Animated.Text
          style={[
            styles.title,
            {
              fontSize: titleSize,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          Live Metal Prices
        </Animated.Text>

        <View style={styles.cardGrid}>
          {symbols.map((symbol) => (
            <MetalCard key={symbol.metal} metalSymbol={symbol} />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d16',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 30, // nice even gap before cards
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
