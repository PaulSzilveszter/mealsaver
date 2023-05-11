import React from "react";
import {Image, StyleSheet} from "react-native"

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
    const imageSource = selectedImage !== null
      ? { uri: selectedImage }
      : placeholderImageSource;
  
    return <Image source={imageSource} style={styles.image} alt="" />;
  }

  const styles = StyleSheet.create({
   
    image:{
        marginTop:20,
        borderColor:"white",
        borderWidth:3,
        height:320,
        width:200,
    }
})