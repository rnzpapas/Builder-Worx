import { StyleSheet, TextInput, View, Platform, StatusBar, TouchableOpacity} from 'react-native'
import { BoldModText, ModText } from '@/components/StyledText'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react'
import {updatePassword} from 'firebase/auth';
import { FIREBASE_AUTH } from '@firebaseConfig';
import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function change_password() {
  const USER_AUTH = FIREBASE_AUTH.currentUser;
  const USER_ID = USER_AUTH?.uid;
  const [oldPw, setOpw] = useState("");
  const [newPw, setNpw] = useState("");
  const [confNewPw, setConfNewPw] = useState("");
  const [isOpwShown, setIsOpwShown] = useState(false);
  const [isNpwShown, setIsNpwShown] = useState(false);
  const [isConfNpwShown, setIsConfNpwShown] = useState(false);


  const onChangeOpw = (val : string) => {
    setOpw(val);
  }

  const onChangeNpw = (val : string) => {
    setNpw(val);
  }

  const onChangeConfNpw = (val : string) => {
    setConfNewPw(val);
  }
  
  const toggleOpw = () => {
    setIsOpwShown(!isOpwShown);
  }
  
  const toggleNpw = () => {
    setIsNpwShown(!isNpwShown);
  }

  const toggleCnpw = () => {
    setIsConfNpwShown(!isConfNpwShown);
  }

  const changePassword = () => {
    if(newPw !== confNewPw) return alert("Two passwords does not match.");
    if(newPw.length < 6) return alert("The password must be 6 characters or more.");
    let user = FIREBASE_AUTH.currentUser
    if(user){
      updatePassword(user, newPw)
      .then(() => {
        return alert("Successfully changed your password.");
      }).catch((err) => {
        return alert("There is something wrong with our server." + err);
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
          <Link replace style={styles.backBtn} href={{ 
            pathname: "/(tabs)/client/(profile)/id=[id]",
            params: {id : USER_ID !== undefined ? USER_ID : ""}

          }}>
            <AntDesign name="back" size={32} color="#FAF9F6" />
          </Link>
          <BoldModText style={styles.title}> Change Password </BoldModText>
        </LinearGradient>
        <View style={styles.infoCont}>
          <View>
            <BoldModText style={styles.infoDesc}> Old Password: </BoldModText>
            <View style={styles.infoInputCont}>
              <TextInput style={styles.infoInput} placeholder="e.g. y0uR0!dP4s5w0rD" onChangeText={(val) => onChangeOpw(val)} secureTextEntry={isOpwShown ? false : true} />
              <View style={styles.pwIconCont}>
                <Ionicons name="eye" size={24} color="black" style={isOpwShown ? styles.pwIconInactive: {display: 'flex'}} onPress={toggleOpw}/>
                <Ionicons name="eye-off" size={24} color="black" style={isOpwShown ? {display: "flex"} : styles.pwIconInactive} onPress={toggleOpw}/>
              </View>
            </View>
          </View>
          <View>
            <BoldModText style={styles.infoDesc}> New Password: </BoldModText>
            <View style={styles.infoInputCont}>
              <TextInput style={styles.infoInput} placeholder="e.g. czHas16mHaP!" onChangeText={(val) => onChangeNpw(val)} secureTextEntry={isNpwShown ? false : true} />
              <View style={styles.pwIconCont}>
                <Ionicons name="eye" size={24} color="black" style={isNpwShown ? styles.pwIconInactive : {display: 'flex'}} onPress={toggleNpw}/>
                <Ionicons name="eye-off" size={24} color="black" style={isNpwShown ? {display: "flex"} : styles.pwIconInactive} onPress={toggleNpw}/>
              </View>
            </View>
          </View>
          <View>
            <BoldModText style={styles.infoDesc}> Confirm Password: </BoldModText>
            <View style={styles.infoInputCont}>
              <TextInput style={styles.infoInput} placeholder="e.g. czHas16mHaP!" onChangeText={(val) => onChangeConfNpw(val)} secureTextEntry={isConfNpwShown ? false : true} />
              <View style={styles.pwIconCont}>
                <Ionicons name="eye" size={24} color="black" style={isConfNpwShown ? styles.pwIconInactive : {display: 'flex'}} onPress={toggleCnpw}/>
                <Ionicons name="eye-off" size={24} color="black" style={isConfNpwShown ? {display: "flex"} : styles.pwIconInactive} onPress={toggleCnpw}/>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.changePw} activeOpacity={0.8} onPress={changePassword}>
            <ModText style={styles.changePwTxt}> Change Password </ModText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    height: "100%"
  },
  header:{
    height: "30%",
  },
  linearGradientBg:{
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    position: "relative"
  },
  backBtn: {
    position: "absolute",
    top: 10,
    left: 10
  },
  title:{
    color: "#FAF9F6",
    fontSize: 28,
    fontWeight: "500",
    marginHorizontal: 10
  },
  infoCont:{
    height: "70%",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20
  },
  infoDesc:{
    fontSize: 22
  },
  infoInputCont:{
    flexDirection: "row",
    marginHorizontal: 10
  },
  infoInput:{
    width: "90%",
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black"
  },
  pwIconCont:{
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "center",
    width: "10%"
  },
  pwIconInactive:{
    display: "none"
  },
  changePw:{
    backgroundColor: "#2883D4",
    padding: 10,
    alignItems: "center",
  },
  changePwTxt:{
    color: "#FAF9F6",
    fontWeight: "600",
    fontSize: 18,
  }
})