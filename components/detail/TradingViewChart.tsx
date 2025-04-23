import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

interface IframeChartProps {
  coinId: string;
}

export default function TradingViewMiniChart({
  coinId = "BTC",
}: IframeChartProps) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TradingView Mini Chart</title>
        <style>
          body { margin: 0; padding: 0; background: transparent; }
          .tradingview-widget-container { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
          {
            "symbol": "MEXC:${coinId}USDT",
    "width": "100%",
    "height": "300",
    "locale": "en",
    "dateRange": "1D",
    "colorTheme": "light",
    "trendLineColor": "rgba(230, 145, 56, 1)",
    "underLineColor": "rgba(246, 178, 107, 1)",
    "underLineBottomColor": "rgba(249, 203, 156, 0)",
    "isTransparent": false,
    "autosize": false,
    "largeChartUrl": "",
    "noTimeScale": true
          }
          </script>
        </div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        onLoadStart={() => console.log("WebView loading started")}
        onLoad={() => console.log("WebView loaded successfully")}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error:", nativeEvent);
        }}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading chart...</Text>
          </View>
        )}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
  },
  webview: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
