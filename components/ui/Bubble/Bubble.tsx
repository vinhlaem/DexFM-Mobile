import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
// import { scale, verticalScale, moderateScale } from "react-native-size-matters";

interface BubbleContainerProps {
  smallBubble?: boolean;
}

interface BubbleProps {
  word: string;
  number: number;
  smallBubble?: boolean;
  hideDetails?: boolean;
  onPress?: () => void;
}

const Bubble = ({
  word,
  number,
  smallBubble = false,
  hideDetails = false,
  onPress,
}: BubbleProps) => {
  const num = number.toString();
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.containerBubble}>
        {!hideDetails ? (
          <Text style={styles.bubbleNumber}>{`${num}.`}</Text>
        ) : null}
        <Text style={styles.bubbleText}>{word}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Bubble;

const styles = StyleSheet.create({
  containerBubble: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    height: 40,
    width: 110,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
  },
  bubbleText: {
    fontSize: 16,
    color: "#000",
  },
  bubbleNumber: {
    fontSize: 16,
    color: "#000",
  },

  bubbleLine: {
    backgroundColor: "gray",
    height: "50%",
    width: 2,
  },
});
