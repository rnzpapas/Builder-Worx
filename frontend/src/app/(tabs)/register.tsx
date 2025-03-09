import { useState } from 'react';
import { Link, Redirect, router } from 'expo-router'
import { ModText } from '@/components/StyledText';
import { StyleSheet, View, Platform, StatusBar, ImageBackground, Image, TextInput} from 'react-native'
import {FIREBASE_AUTH, FIREBASE_DB} from "@firebaseConfig";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {ref, set} from "firebase/database";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function register() {
  const [fullname, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerUser = () => {
    if(fullname.length === 0 || 
      city.length === 0 ||
      phoneNumber.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0 
    ) return alert("Please fill out all fields.");
    if(phoneNumber.length < 11) return alert("Please provide an 11-digit phone number");
    if(password.length < 6) return alert("The password must be more than 5 characters.");
    if(password !== confirmPassword) return alert("The passwords does not match.");

    createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
    .then((response) => {
      const userRef = ref(FIREBASE_DB, 'users/' + response.user.uid);
      set(userRef, {
        fullname: fullname,
        city: city,
        phoneNumber: phoneNumber,
        type: "client"
      });
      router.replace("/");
    })
    .catch((error) => {
      switch (error.message) {
        case "Firebase: Error (auth/email-already-in-use).":
          alert("This user already exists.");
          break;
        default:
          break;
      }
    });

  }
  const onChangeFullName = (fullname : string) => {
    setFullName(fullname);
  }
  const onChangeCity = (city : string) => {
    setCity(city);
  }
  const onChangeEmail = (email : string) => {
    setEmail(email);
  }
  const onChangePassword = (password : string) => {
    setPassword(password);
  }
  const onChangeConfirmPassword = (confPassword : string) => {
    setConfirmPassword(confPassword);
  }
  const onChangePhoneNumber = (cpNumber : string) => {
    setPhoneNumber(cpNumber);
  }
  return (
    
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require("@assets/images/resources/01/login_screen.jpg")} resizeMode='cover'>
          <View style={styles.logoContainer}>
            <Image source={require("@assets/images/resources/system/builder_worx_icn.png")} resizeMode='center'/>
          </View>
          <KeyboardAwareScrollView>
            <View style={styles.formContainer}> 
              <TextInput placeholder='Full Name' placeholderTextColor={"#DDD5D5"} style={styles.input} onChangeText={(fullname) => onChangeFullName(fullname)}/>
              <TextInput placeholder='City' placeholderTextColor={"#DDD5D5"} style={styles.input} onChangeText={(city) => onChangeCity(city)}/>
              <TextInput placeholder='Phone Number' placeholderTextColor={"#DDD5D5"} style={styles.input} onChangeText={(cpn) => onChangePhoneNumber(cpn)}/>
              <TextInput placeholder='Email' placeholderTextColor={"#DDD5D5"} style={styles.input} onChangeText={(email) => onChangeEmail(email)}/>
              <TextInput placeholder='Password' placeholderTextColor={"#DDD5D5"} secureTextEntry={true} style={styles.input} onChangeText={(pw) => onChangePassword(pw)}/>
              <TextInput placeholder='Confirm Password' placeholderTextColor={"#DDD5D5"} secureTextEntry={true} style={styles.input} onChangeText={(cpw) => onChangeConfirmPassword(cpw)}/>
              <ModText style={styles.loginBtn} onPress={registerUser}> Register </ModText>
              <View style={styles.registerLinkContainer}>
                <ModText style={styles.registerText}> Already have an account?</ModText>
                <Link href={"/"} style={styles.registerLink}> Sign In</Link>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    flex: 1,
  },
  backgroundImage: {
    flex: 1, 
  },
  logoContainer:{
    backgroundColor: "transparent",
    height: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  // logoImage:{
  // }, 
  tagLine:{
    paddingLeft: 45,
    paddingRight: 100,
    fontSize: 20,
    color: "#FAF9F6"
  },
  formContainer:{
    backgroundColor: "transparent",
    marginHorizontal: 20,
    gap: 10
  },
  input:{
    fontFamily: "Karla",
    color: "#FAF9F6",
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    padding: 2
  },
  loginBtn:{
    fontSize: 18,
    color: "#FAF9F6",
    backgroundColor: "#2883D4",
    padding: 5,
    textAlign: "center"
  },
  loginBtnTxt:{
    color: "#FAF9F6",
  },
  registerLinkContainer:{
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center"
  },
  registerText:{
    color: "#FAF9F6"
  },
  registerLink:{
    fontFamily: "Karla",
    color: "#2883D4",
    fontWeight: "700"
  }
})