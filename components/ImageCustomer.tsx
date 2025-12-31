import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { minidenticon } from "minidenticons";
import { SvgXml } from "react-native-svg";

interface CustomImageProps {
  source?: string; // URL for the image
  style?: StyleProp<ViewStyle>;
  avatar?: boolean; // Show avatar fallback icon
  rounded?: boolean; // Should the image/icon be rounded
  boxShadow?: boolean; // Add shadow to the container
  size?: number; // Size of the fallback icon
  iconColor?: string; // Color of the fallback icon
  width?: number;
  height?: number;
  blurhash?: string; // Blurhash placeholder for loading
  address?: string;
}

const CustomImage: React.FC<CustomImageProps> = React.memo(
  ({
    source,
    style,
    width = 30,
    height = 30,
    avatar = false,
    rounded = true,
    boxShadow = true,
    size = 20,
    iconColor = "#ccc",
    blurhash,
    address,
  }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const isSourceValid = source && source !== "";

    const onLoadStart = useCallback(() => {
      setLoading(true);
    }, []);

    const onLoadEnd = useCallback(() => {
      setLoading(false);
    }, []);

    const onError = useCallback(() => {
      setError(true);
      setLoading(false);
    }, []);
    const svgXml = useMemo(() => {
      if (!address) return null;
      const svg = minidenticon(address, 90, 50);
      return svg.replace(/viewBox="[^"]*"/, 'viewBox="0 0 5 5"');
    }, [address]);

    const isURIValid = address && address !== "";

    return (
      <View
        style={[
          styles.container,
          rounded && styles.rounded,
          boxShadow && styles.boxShadow,
          style,
          { width, height },
        ]}
      >
        {loading && error && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="#ccc" />
          </View>
        )}

        {isSourceValid && !error && isURIValid ? (
          <SvgXml
            xml={svgXml}
            width={width}
            height={height}
            style={[styles.image, rounded && styles.rounded]}
          />
        ) : isSourceValid && !error && !isURIValid ? (
          <Image
            source={source}
            style={[styles.image, rounded && styles.rounded]}
            contentFit="cover"
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            onError={onError}
            placeholder={{ blurhash }}
          />
        ) : (
          <Ionicons
            name={avatar ? "person-circle" : "alert-circle"}
            size={size}
            color={iconColor}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
  rounded: {
    borderRadius: 100, // Fully rounded for circular images/icons
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CustomImage;
