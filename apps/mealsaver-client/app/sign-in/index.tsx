import React from "react"
import {View, StyleSheet, Text, ScrollView} from "react-native"

import LoginScreen from "../../components/LoginScreen/LoginScreen"
import { AuthProvider } from "../../context/auth"

export default function SignIn(){
    return (

        <>
            <LoginScreen/>
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