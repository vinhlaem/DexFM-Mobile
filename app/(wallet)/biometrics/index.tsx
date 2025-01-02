import { useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useSelector, useDispatch } from "react-redux";

import { ThemeType } from "../../../styles/theme";
import { AppDispatch, RootState } from "@/store";
import { authenticate } from "@/store/biometricsSlice";
import { ROUTES } from "@/constants/routes";

export default function Biometrics() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { chain } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [checkedEnrollment, setCheckEnrollment] = useState(false);

  const isEnrolled = useSelector(
    (state: RootState) => state.biometrics.isEnrolled
  );

  useFocusEffect(() => {
    setLoading(false);
  });

  const handleEnrollAuthentication = async () => {
    dispatch(authenticate());
    setCheckEnrollment(true);
  };

  return <Text>bbbb</Text>;
}