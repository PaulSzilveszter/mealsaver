import { Slot } from "expo-router";
import React from 'react';

import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/auth";

import { View, StyleSheet, ScrollView } from "react-native";

export default function Layout() {
  return (

    <AuthProvider>

<View style={styles.layoutWrapper}>
      <Header />
      <ScrollView style={styles.slotContainer}>
        <Slot />
      </ScrollView>
      <Footer />
    </View>

    </AuthProvider>

    
  
  )
}

const styles = StyleSheet.create({
  layoutWrapper: {
    position: "relative",
    flex: 1,
    backgroundColor: "#252525",
  },
  slotContainer: {
    flex: 1, // this makes the Slot component take all remaining space
  }
});