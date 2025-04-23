import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface HeaderPageProps {
    title: string
}

const HeaderPage = ({title}: HeaderPageProps) => {
  return (
    <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>

        <View/>
    </View>
  )
}

export default HeaderPage

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        justifyContent: "space-between",
      },
      headerText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
      },
})