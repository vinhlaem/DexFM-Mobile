import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import Bubble from "@/components/ui/Bubble/Bubble";
import * as Clipboard from "expo-clipboard";
import { getPhrase } from "@/hooks/useStorageState";
import { ROUTES } from "@/constants/routes";
import { IconSymbol } from "@/components/ui/IconSymbol";
import images from "@/constants/images";
import { StatusBar } from "expo-status-bar";

const SeedPhare = () => {
  const { phrase, readOnly } = useLocalSearchParams();
  const seedPhraseParams = phrase ? (phrase as string).split(" ") : [];
  const [seedPhrase, setPhrase] = useState(seedPhraseParams);
  const [buttonText, setButtonText] = useState("Copy to clipboard");

  const handleCopy = async () => {
    await Clipboard.setStringAsync(seedPhraseParams.join(" "));
    setButtonText("Copied!");
    setTimeout(() => {
      setButtonText("Copy to clipboard");
    }, 4000);
  };

  useEffect(() => {
    const fetchPhrase = async () => {
      const phraseStorage = await getPhrase();

      if (phraseStorage) {
        setPhrase(phraseStorage.split(" "));
      } else {
        console.warn("No phrase found in storage.");
        setPhrase([]);
      }
    };
    if (readOnly) {
      fetchPhrase();
    }
  }, [readOnly]);

  return (
    <View style={styles.SafeAreaContainer}>
      <ImageBackground
        source={images.image}
        resizeMode="cover"
        //   style={styles.imageBackground}
      >
        <ScrollView contentContainerStyle={{ paddingTop: 50 }}>
          <View style={styles.ContentContainer}>
            <View style={styles.TextContainer}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <TouchableOpacity onPress={() => router.back()}>
                  <IconSymbol name="arrow.left" color="#000" size={20} />
                </TouchableOpacity>
                <Text style={styles.textTile}>Secret Recovery Phrase</Text>
              </View>

              <Text style={styles.textDescription}>
                This is the only way you will be able to recover your account.
                Please store it somewhere safe!
              </Text>
            </View>
            <View style={styles.SeedPhraseContainer}>
              {seedPhrase.map((word, index) => (
                <Bubble key={index} word={word} number={index + 1} />
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.ButtonContainer}>
          <TouchableOpacity
            style={styles.SecondaryButtonContainer}
            onPress={handleCopy}
          >
            <Text>{buttonText}</Text>
          </TouchableOpacity>
          {readOnly ? null : (
            <TouchableOpacity
              style={[
                styles.SecondaryButtonContainer,
                {
                  backgroundColor: "#24d0c9",
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/(wallet)/seed/confirm-seed-phrase",
                  params: { phrase: seedPhrase },
                })
              }
            >
              <Text>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default SeedPhare;

const styles = StyleSheet.create({
  SafeAreaContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },

  ContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  TextContainer: {
    marginBottom: 10,
  },
  textTile: {
    fontSize: 24,
    fontWeight: 700,
  },
  textDescription: {
    fontSize: 16,
    fontWeight: 400,
    marginTop: 10,
  },

  SeedPhraseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 50,
    // marginRight: 10,
    // marginLeft: 10,
  },
  SecondaryButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    height: 40,
    marginTop: 20,
    backgroundColor: "#fff",
    width: "50%",
    borderRadius: 50,
  },

  ButtonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    padding: 20,
  },
});
