import { LIST_LINK } from "@/constants/ListNetwork";
import React, { useRef, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

interface IframeScreenProps {
  chainId: string;
  pairAddress: string;
}

export default function IframeChart({
  chainId,
  pairAddress,
}: IframeScreenProps) {
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  const url = `https://dexscreener.com/${chainId}/${pairAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=light&theme=dark&chartStyle=1&chartType=usd&interval=15`;

  return (
    <View style={styles.container}>
      <WebView
        // ref={webViewRef}
        source={{ uri: url }}
        onLoadEnd={() => setIsLoadingIframe(false)}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        originWhitelist={["http://", "https://", "blob"]}
      />
      {isLoadingIframe && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: "100%",
    height: 500,
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
