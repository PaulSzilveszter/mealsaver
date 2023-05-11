import React from "react"
import { useState } from "react"
import {View, StyleSheet, Text, ScrollView, Image, Pressable} from "react-native"


import ImageViewer from "../../components/ImageViewer"
import * as ImagePicker from 'expo-image-picker';


import placeholderImage from "../../assets/images/splash.png"



export default function Home(){

    const [selectedImage, setSelectedImage] = useState(null);


    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
          console.log(result);

        } else {
          alert('You did not select any image.');
        }
      };

    
    return (

        <>
            <View style={styles.scrollview}>
            <ImageViewer placeholderImageSource={placeholderImage} selectedImage={selectedImage} />
            <Pressable
          style={ { backgroundColor: '#fff' }}
          onPress={pickImageAsync}
        ><Text>sss</Text>
        </Pressable>
            
            </View>
        </>

    )
}
const styles = StyleSheet.create({
    scrollview: {
        flex: 1,
        justifyContent: 'flex-start', // Center items vertically
        alignItems: "center", // Center items horizontally
        
        height:"100%",
      width:"100%",
      backgroundColor:"#252525",
      color:"white",
    },
    imageContainer:{
        marginTop:20,
        borderColor:"white",
        borderWidth:3,
        height:320,
        width:200,
    }
})