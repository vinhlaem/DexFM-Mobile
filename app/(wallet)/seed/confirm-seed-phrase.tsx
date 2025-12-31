import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocalSearchParams, useRouter } from "expo-router";
import Bubble from "@/components/ui/Bubble/Bubble";
import { savePhrase } from "@/hooks/useStorageState";
import * as Clipboard from "expo-clipboard";
import images from "@/constants/images";

const ConfirmSeedPhrase = () => {
  const router = useRouter();
  const { phrase } = useLocalSearchParams();
  const seedPhraseParams = phrase
    ? (phrase as string).split(",").sort(() => 0.5 - Math.random())
    : [];

  const [seedPhrase, setSeedPhrase] = useState<string[]>(seedPhraseParams);
  const [error, setError] = useState<string>("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const handleRemoveSelectedWord = (word: string) => {
    setSelectedWords(selectedWords.filter((w) => w !== word));
    setSeedPhrase([...seedPhrase, word]);
  };

  const handleSelectedWord = (word: string) => {
    if (selectedWords.length === 12) return;

    setSelectedWords([...selectedWords, word]);
    setSeedPhrase(seedPhrase.filter((w) => w !== word));
  };

  const handleVerifySeedPhrase = async () => {
    if (selectedWords.length !== 12) {
      setError("Please select all the words to verify your seed phrase");
      return;
    }

    if (selectedWords.join(",") === phrase) {
      try {
        const originalPhrase = JSON.stringify(phrase.split(",").join(" "));
        await savePhrase(originalPhrase);
      } catch (e) {
        console.error("Failed to save private key", e);
        throw e;
      }
      router.push({
        pathname: `/(wallet)/setup/wallet`,
        params: { successState: "CREATED_WALLET" },
      });
    } else {
      setError("Looks like the seed phrase is incorrect. Please try again.");
    }
  };

  const fetchCopiedText = async () => {
    const copiedText = await Clipboard.getStringAsync();
    const phraseString = phrase as string;
    const originalPhrase = phraseString.split(",").join(" ");
    const isValid = copiedText === originalPhrase;
    if (isValid) {
      setSelectedWords(copiedText.split(" "));
      setSeedPhrase([]);
    }
  };

  return (
    <View style={styles.SafeAreaContainer}>
      <ImageBackground
        source={images.image}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View>
          <ScrollView contentContainerStyle={{ paddingTop: 50 }}>
            <View style={styles.ContentContainer}>
              <View style={styles.TextContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="arrow.left" color="#000" size={20} />
                  </TouchableOpacity>
                  <Text style={styles.textTile}>
                    Verify you saved it correctly
                  </Text>
                </View>

                <Text style={styles.textDescription}>
                  Tap the words in the correct numerical order to verify you
                  saved your secret recovery phrase.
                </Text>
              </View>
              <View style={styles.ConfirmSeedContainer}>
                {selectedWords.map((word, index) => (
                  <Bubble
                    smallBubble
                    hideDetails
                    key={index}
                    word={word}
                    number={index + 1}
                    onPress={() => handleRemoveSelectedWord(word)}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={styles.SecondaryButtonContainer}
                onPress={() => fetchCopiedText()}
              >
                <Text>Paste Phrase</Text>
              </TouchableOpacity>
              <View style={styles.SeedContainer}>
                {seedPhrase.map((word, index) => (
                  <Bubble
                    onPress={() => handleSelectedWord(word)}
                    smallBubble
                    hideDetails
                    key={index}
                    word={word}
                    number={index + 1}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
        {error && (
          <View>
            <Text style={styles.TextError}>*{error}</Text>
          </View>
        )}
        <View style={styles.ButtonContainer}>
          <TouchableOpacity
            style={styles.SecondaryButtonContainer}
            onPress={handleVerifySeedPhrase}
          >
            <Text>Verify seed phrase</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ConfirmSeedPhrase;

const styles = StyleSheet.create({
  SafeAreaContainer: {
    flex: 1,
    // backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    padding: 0,
  },
  headerAction: {
    alignSelf: "stretch",
    backgroundColor: "#f0f0f0",
    padding: 16,
    alignItems: "flex-start",
  },
  ContentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
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
  SeedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 20,
    // marginRight: 10,
    // marginLeft: 10,
  },
  ConfirmSeedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#fff",
    height: "auto",
    minHeight: 200,
  },
  TextError: {
    color: "red",
    fontSize: 15,
    fontWeight: 500,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 10,
    textAlign: "center",
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
    marginTop: 10,
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#000",
  },

  ButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingLeft: 25,
    paddingRight: 25,
  },
});
