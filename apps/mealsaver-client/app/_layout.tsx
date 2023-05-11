import { Slot } from "expo-router";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { View , StyleSheet} from "react-native";


export default function Layout(){
  return (
    <View style={styles.layoutWrapper}>
    
    <Header></Header>
    <Slot></Slot>
    <Footer/>
    </View>

  )
}

const styles = StyleSheet.create({
    layoutWrapper: {
      flex:1,
      flexDirection:"column",
      height:"100%",
      width:"100%",
      backgroundColor:"lime",
      color:"white"
    }
})

