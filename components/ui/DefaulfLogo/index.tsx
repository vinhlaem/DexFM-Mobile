import { randomColor } from '@/utils/randomcolor';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react'
import { StyleSheet, Text } from 'react-native';

export default function DefaultLogo({ symbol }: { symbol: string }) {

    const getRandomColors = () => {
        return [randomColor(), randomColor(), randomColor()];
      };
    
      const [colors, setColors] = useState(getRandomColors());
  return (
    <LinearGradient
      colors={[colors[0], colors[1], colors[2]]}
      style={{
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      }}
    >
      <Text style={styles.textLogo}>{symbol.slice(0, 1)}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  textLogo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
  },
});
