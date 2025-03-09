import { useState } from 'react';
import { View } from '@components/Themed';
import { ModText } from '@/components/StyledText';
import { router,  Link} from 'expo-router';
import { StyleSheet, Platform, StatusBar, Image, ImageBackground, TextInput} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_DB} from "@firebaseConfig";
import {signInWithEmailAndPassword } from "firebase/auth";
import {ref, get, child} from "firebase/database";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const onChangeEmail = (email : string) => {
    setUserEmail(email);
  }
  const onChangePassword = (password: any) => {
    setUserPassword(password);
  }
  const onLoginSubmit = () => {
    if(userEmail.length !== 0 && userPassword.length !== 0  ){
      signInWithEmailAndPassword(FIREBASE_AUTH,userEmail, userPassword)
      .then((response) => {
        const rootRef = ref(FIREBASE_DB)
        const userRef = 'users/' + response.user.uid;
        get(child(rootRef, userRef))
        .then((snapshot) => { 
          var userLoaded;
          if(snapshot.exists()){ 
            userLoaded = snapshot.val()
            switch (userLoaded.type) {
              case 'client':
                router.replace("/client/");
                break;
              case 'worker':
                router.replace("/worker/");
                break;
              case 'admin':
                router.replace("/admin/");
                break;
              default:
                router.replace("/");
                break;
            }
          }
        }).catch(err => {
          console.error(err)
        })
        
      })
      .catch((error) => {
        console.log(error)
        switch (error.message) {
          case "Firebase: Error (auth/invalid-email).":
            alert("The email you entered is invalid.");
            break;
          case "Firebase: Error (auth/invalid-credential).":
            alert("The username or password is invalid.");
            break;
          case "Firebase: Error (auth/invalid-login-credentials).":
            alert("The username or password is invalid.");
            break;
          default:
            break;
        }
  
      });
    }else{
      alert("Please fill out all fields.");
    }
  }
  return (
    
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require("@assets/images/resources/01/login_screen.jpg")} resizeMode='cover'>
          <View style={styles.logoContainer}>
            <Image source={require("@assets/images/resources/system/builder_worx_icn.png")} resizeMode='center'/>
          </View>
          <KeyboardAwareScrollView style={{height: "100%"}}>
            <View style={styles.formContainer}> 
              <TextInput placeholder='Email' placeholderTextColor={"#DDD5D5"} style={styles.input} onChangeText={(evt) => onChangeEmail(evt)}/>
              <TextInput placeholder='Password' placeholderTextColor={"#DDD5D5"} secureTextEntry={true} style={styles.input} onChangeText={(evt) => onChangePassword(evt)}/>
              <ModText style={styles.loginBtn} onPress={onLoginSubmit}> Login </ModText>
              <View style={styles.registerLinkContainer}>
                <ModText style={styles.registerText}> Don't have an account?</ModText>
                <Link href={"/register"} style={styles.registerLink}> Sign Up</Link>
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
    height: "100%"
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
    borderBottomColor: "#FAF9F6",
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