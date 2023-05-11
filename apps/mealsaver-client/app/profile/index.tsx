import React from "react"
import {View, StyleSheet, Text, ScrollView} from "react-native"

export default function Home(){
    return (

        <>
            <ScrollView style={styles.scrollview}>
                <Text style={{color:"#AFD3E2"}}>Ciao</Text>
            </ScrollView>
        </>

    )
}
const styles = StyleSheet.create({
    scrollview: {
      flex:1,
      flexDirection:"column",
      height:"100%",
      width:"100%",
      backgroundColor:"#252525",
      color:"white"
    }
})