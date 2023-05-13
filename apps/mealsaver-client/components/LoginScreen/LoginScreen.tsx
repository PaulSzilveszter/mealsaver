import React from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, Button } from "react-native";

export default function LoginScreen() {
    return (
  
      <View >
        <Text>
            Sal
        </Text>
        <TextInput  
          placeholder={'username or email'}
          secureTextEntry={false}
        />
        <TextInput  
          placeholder={'password'}
          secureTextEntry={true}
        />
        <Button
          title={'Login'}
        />


      </View>
    
    )
  }