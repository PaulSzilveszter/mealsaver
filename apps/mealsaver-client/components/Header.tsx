import { StyleSheet , View, Text} from "react-native";

export  default function Header(){
    return (
        <>

            <View style={styles.header}></View>

        </>
    )
}

const styles = StyleSheet.create({
    header:{
        height:50,
        width:"100%",
        backgroundColor:"#008200"
    }

})