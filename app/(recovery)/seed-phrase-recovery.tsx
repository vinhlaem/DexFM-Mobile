import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getPhrase } from "@/hooks/useStorageState";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import HeaderPage from "@/components/ui/HeaderPage";

const SeedPhraseRecovery = () => {
  const [recoveryWords, setRecoveryWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchPhrase = async () => {
      const startTime = Date.now();
      const phrase = await getPhrase();
      const elapsedTime = Date.now() - startTime;

      if (phrase) {
        setRecoveryWords(phrase.split(" "));
      }

      const remainingTime = 500 - elapsedTime;
      setTimeout(
        () => {
          setLoading(false);
        },
        remainingTime > 0 ? remainingTime : 0,
        0 ? remainingTime : 0
      );
    };
    fetchPhrase();
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(recoveryWords.join(" "));
    alert("Recovery Phrase copied to clipboard!");
  };

  const renderWordItem = useCallback(
    (item: string, index: number) => (
      <View key={`${item}-${index}`} style={styles.wordContainer}>
        <Text style={styles.wordIndex}>{index + 1}</Text>
        <Text style={styles.wordText}>{item}</Text>
      </View>
    ),
    []
  );

  const renderLoadingPlaceholder = () => {
    const placeholderItems = Array(12).fill("Loading...");
    return (
      <View style={styles.wordsContainer}>
        {placeholderItems.map((item, index) => (
          <View key={index} style={styles.wordContainer}>
            <Text style={styles.wordIndex}>{index + 1}</Text>
            <Text style={styles.wordText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 20 }}>
        <HeaderPage title="Your Recovery Phrase" />
      </View>

      {/* Warning Section */}
      <View style={styles.warningContainer}>
        <Text style={styles.warningTitle}>
          Do not share your Recovery Phrase!
        </Text>
        <Text style={styles.warningText}>
          If someone has your Recovery Phrase they will have full control of
          your wallet.
        </Text>
      </View>

      {/* Recovery Words Grid or Loading */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          renderLoadingPlaceholder()
        ) : (
          <View style={styles.wordsContainer}>
            {recoveryWords.map((item, index) => renderWordItem(item, index))}
          </View>
        )}
      </ScrollView>

      {/* Copy to Clipboard Button */}
      <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
        <Ionicons
          name="copy-outline"
          size={20}
          color="black"
          style={styles.copyIcon}
        />
        <Text style={styles.copyText}>Copy to clipboard</Text>
      </TouchableOpacity>

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SeedPhraseRecovery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  warningContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  warningTitle: {
    color: "#FF5555",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  warningText: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    padding: 10,
    borderRadius: 10,
    width: "30%",
    marginBottom: 10,
  },
  wordIndex: {
    color: "black",
    fontSize: 14,
    marginRight: 10,
  },
  wordText: {
    color: "black",
    fontSize: 14,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  copyIcon: {
    marginRight: 5,
  },
  copyText: {
    color: "black",
    fontSize: 14,
  },
  doneButton: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 50,
    shadowColor: "rgba(43, 45, 51)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    width: "90%",
    marginHorizontal: 20,
    ...Platform.select({
      android: {
        marginBottom: 10, 
      },
    }),
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
