import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import WrapDashboard from "@/components/home/WrapDashboard";
import ListPortfolio from "@/components/home/ListPortfolio";

const Tab = () => {
  return (
   <WrapDashboard>
    <ListPortfolio/>
   </WrapDashboard>
  );
};

export default Tab;

