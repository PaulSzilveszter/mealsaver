import React from "react"
import {View, StyleSheet, Text, ScrollView} from "react-native"

export default function Home(){
    return (

        <>
            <ScrollView style={styles.scrollview}>
                <Text></Text>
            </ScrollView>
        </>

    )
}
const styles = StyleSheet.create({
    scrollview: {
    //   flex:1,
      height:"100%",
      width:"100%",
      backgroundColor:"#252525",
      color:"white"
    }
})