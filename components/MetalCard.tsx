import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, ActivityIndicator } from "react-native";

const MetalCard = ({ metalSymbol }) => {
  const [timestampText, setTimestampText] = useState("0 sec ago");
  const [loading, setLoading] = useState(true);

  const formatTimeAgo = (seconds) => {
    if (seconds < 60) return `Updated ${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Updated ${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Updated ${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `Updated ${days} day${days > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    const updatedAt = new Date(metalSymbol.timestamp * 1000);

    const interval = setInterval(() => {
      const now = new Date();
      const secondsAgo = Math.floor((now - updatedAt) / 1000);
      setTimestampText(formatTimeAgo(secondsAgo));
    }, 1000);

    return () => clearInterval(interval);
  }, [metalSymbol.timestamp]);

  useEffect(() => {
    // Simulate loading (you can replace this with actual API call logic)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5s delay for animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href={`/metal/${metalSymbol.metal.toLowerCase()}`} asChild>
      <Pressable style={styles.card}>
        <Text style={styles.metalName}>
          {metalSymbol.metal.charAt(0).toUpperCase() + metalSymbol.metal.slice(1)}
        </Text>

        <View style={styles.parent}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFD700" />
          ) : (
            <Text style={styles.price}>
              ₹{metalSymbol.price.toFixed(2)} / g
            </Text>
          )}
        </View>

        {!loading && (
          <View style={styles.parent}>
            <Text style={styles.timestamp}>{timestampText}</Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#131b24",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 4,
    width: "47%",
    aspectRatio: 1,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  parent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  metalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
    textAlign: "center",
  },
  price: {
    fontSize: 12,
    color: "#3e4651",
    fontWeight: "500",
    textAlign: "left",
    alignSelf: "center",
  },
  timestamp: {
    fontSize: 10,
    color: "#3e4651",
    marginTop: 4,
    textAlign: "center",
  },
});

export default MetalCard;
