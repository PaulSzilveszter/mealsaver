import { StyleSheet , View } from "react-native";
import React from 'react';

export default function Header() {
  return (
    <View style={styles.header} />
  );
}

const styles = StyleSheet.create({
    header:{
        position:"relative",
        top:0,
        height:50,
        width:"100%",
        backgroundColor:"#008200"
    }
})
