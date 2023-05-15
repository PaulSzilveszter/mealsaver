import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, Button } from "react-native";

import { loginUser, registerNewUser } from '../../functions/AuthFunctions';
import { useAuth } from '../../context/auth';


export default function LoginScreen() {

 

  const AuthContext = useAuth()
  

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");    
  const [password, setPassword] = useState("");      


  return (
  
      <View >
        <Text>
            Sal
        </Text>
        <TextInput  
          placeholder={'username'}
          secureTextEntry={false}
          onChange={(e)=>{
            setUsername(e.target.value)
            // console.log(username);
          }}
        />
        <TextInput  
          placeholder={'email'}
          secureTextEntry={false}
          onChange={(e)=>{
            setEmail(e.target.value)
            // console.log(email);
          }}
        />
        <TextInput  
          placeholder={'password'}
          secureTextEntry={true}
          onChange={(e)=>{
            setPassword(e.target.value)
            
          }}
        />
        <Button
          title={'Register'}
          onPress={()=> {registerNewUser(username, email, password)}}
        />
        <Button
          title={'Login'}
          onPress={()=> {

            console.log("AUTH CONTEXT: ",AuthContext)

            try{
              loginUser(username, email, password)
              AuthContext.signIn({username, email, password})
            }catch (e){
              console.log(e)
            }


          }}
        />
         <Button
          title={'Show data'}
          onPress={()=> {

            console.log(AuthContext.user);

          }}
        />

      </View>
    
    )
  }