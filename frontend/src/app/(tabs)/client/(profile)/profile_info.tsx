import { StyleSheet, View, Platform, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions} from 'react-native'
import { BoldModText, ModText } from '@/components/StyledText'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { FIREBASE_AUTH, FIREBASE_DB } from '@firebaseConfig'
import { ref,get, update} from "firebase/database";
import { verifyBeforeUpdateEmail} from "firebase/auth";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function profile_info() {

  const USER_AUTH = FIREBASE_AUTH.currentUser;
  const USER_ID = USER_AUTH?.uid;
  const USER_RD_REF = ref(FIREBASE_DB, "/users/" + USER_ID);
  const [user, setUser] = useState(Object);
  const [fnInputActive, setFnInputActive] = useState(false);
  const [cityInputActive, setCityInputActive] = useState(false);
  const [pnInputActive, setPnInputActive] = useState(false);
  const [emailInputActive, setEmailInputActive] = useState(false);
  const [email, setEmail] = useState("");
  const [fn, setFN] = useState("");
  const [city, setCity] = useState("");
  const [pn, setPn] = useState("");

  const loadUser = async () => {
    if(String(USER_ID).length !== 0){
      const USER_REF = ref(FIREBASE_DB, "/users/" + USER_ID);
      await get(USER_REF)
      .then((snapshot) => {
        if(snapshot.exists()){
          setUser(snapshot.val());
        }
      })
      .catch((err) => {
        console.error("Unable to fetch user data.");
        console.error(err);
        // return <Redirect href={""} />;
      })
    }else{
      return <Redirect href={'/'}/>;
    }
  }

  const toggleFnInput = () => {
    setFnInputActive(!fnInputActive);
  }

  const toggleCityInput = () => {
    setCityInputActive(!cityInputActive);
  }

  const togglePnInput = () => {
    setPnInputActive(!pnInputActive);
  }

  const toggleEmailInput = () => {
    setEmailInputActive(!emailInputActive);
  }

  const onChangeFn = (value : string) => {
    setFN(value);
  }

  const onChangeCity = (value : string) => {
    setCity(value);
  }

  const onChangePn = (value : string) => {
    setPn(value);
  }

  const onChangeEmail = (value : string) => {
    setEmail(value);
  }

  const saveDetails = () => {
    let userObj = {
      fullname: fn.length === 0 ? user.fullname : fn,
      city: city.length === 0 ? user.city : city,
      phoneNumber: pn.length === 0 ? user.phoneNumber : pn,
    }
    update(USER_RD_REF, userObj).then(() => {
      setFnInputActive(false);
      setCityInputActive(false);
      setPnInputActive(false);
      setEmailInputActive(false);
      alert("Successfully updated your data.");
    }).catch(err => {
      alert("There is something wrong in our server. " + err);
    })
    if(USER_AUTH){
      let changedEmail = email.length === 0 ? USER_AUTH?.email !== null ? USER_AUTH.email : '' : email;

      if(!USER_AUTH.emailVerified){
        verifyBeforeUpdateEmail(USER_AUTH, changedEmail)
        .then(() => {
          alert("Please verify your email sent to you email.")
          setFnInputActive(false);
          setCityInputActive(false);
          setPnInputActive(false);
          setEmailInputActive(false);
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }

  const cancelEdit = () => {
    setFnInputActive(false);
    setCityInputActive(false);
    setPnInputActive(false);
    setEmailInputActive(false);
  }

  useEffect(() => {
    loadUser();
  },[USER_ID])
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient
            style={styles.linearGradientBg}
            colors={["#2883D4", "#6928D4"]}
            start={{x: 1, y: 0.5}}
            end={{x: 0, y: 1}}
          >
          <Link style={styles.backBtn} href={{ 
            pathname: "/(tabs)/client/(profile)/id=[id]",
            params: {id : USER_ID !== undefined ? USER_ID : ""}
          }}>
            <AntDesign name="back" size={32} color="#FAF9F6"/>
          </Link>
          <BoldModText style={styles.title}> Profile Information </BoldModText>
          </LinearGradient>
        </View>
        <View style={styles.infoCont}>
          <View>
            <View style={styles.infoTitleWrap}>
              <BoldModText style={styles.infoTitle}> Email: </BoldModText>
              <ModText style={styles.infoChangeTxt} onPress={toggleEmailInput}> Change </ModText>
            </View>
            {
              emailInputActive ? <TextInput style={styles.infoInput} placeholder='e.g. sample@gmail.com' value={email.length === 0 ? USER_AUTH?.email === null ? '' : USER_AUTH?.email : email} onChangeText={(val) => onChangeEmail(val)} /> : <ModText style={styles.infoDesc}> {USER_AUTH?.email} </ModText>
            }
          </View>
          <View>
            <View style={styles.infoTitleWrap}>
              <BoldModText style={styles.infoTitle}> Full Name: </BoldModText>
              <ModText style={styles.infoChangeTxt} onPress={toggleFnInput}> Change </ModText>
            </View>
            {
              fnInputActive ? <TextInput style={styles.infoInput} placeholder='e.g. Robert Samson' value={fn.length === 0 ? user.fullname : fn} onChangeText={(val) => onChangeFn(val)}/> : <ModText style={styles.infoDesc}> {user.fullname} </ModText>
            }
          </View>
          <View>
            <View style={styles.infoTitleWrap}>
              <BoldModText style={styles.infoTitle}> Location: </BoldModText>
              <ModText style={styles.infoChangeTxt} onPress={toggleCityInput}> Change </ModText>
            </View>
            {
              cityInputActive ? <TextInput style={styles.infoInput} placeholder='e.g. Manila City' value={city.length === 0 ? user.city : city} onChangeText={(val) => onChangeCity(val)}/> : <ModText style={styles.infoDesc}> {user.city} </ModText>
            }
          </View>
          <View>
            <View style={styles.infoTitleWrap}>
              <BoldModText style={styles.infoTitle}> Phone Number: </BoldModText>
              <ModText style={styles.infoChangeTxt} onPress={togglePnInput}> Change </ModText>
            </View>
            {
              pnInputActive ? <TextInput style={styles.infoInput} placeholder='e.g. 09125712852' value={pn.length === 0 ? user.phoneNumber : pn} onChangeText={(val) => onChangePn(val)} /> : <ModText style={styles.infoDesc}> {user.phoneNumber} </ModText>
            }
          </View>
        
        </View>
        {
          fnInputActive || cityInputActive || pnInputActive || emailInputActive ?
          <View style={styles.btnCont}> 
            <View style={styles.saveBtnCont}>
                <TouchableOpacity style={styles.saveDetailsBtn} activeOpacity={0.8} onPress={saveDetails}>
                  <ModText style={styles.saveDetailsBtnTxt}> Save Details </ModText>
                </TouchableOpacity>
            </View>
            <View style={styles.cancelBtnCont}>
              <TouchableOpacity style={styles.cancelDetailsBtn} activeOpacity={0.8} onPress={cancelEdit}>
                <ModText style={styles.cancelDetailsBtnTxt}> Cancel </ModText>
              </TouchableOpacity>
            </View>
          </View>
          : ""
        }
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    height: Dimensions.get("window").height
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
    height: "50%",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20
  },
  infoTitleWrap:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  infoTitle:{
    fontSize: 24
  },
  infoChangeTxt:{
    fontSize: 12,
    textDecorationLine: "underline"
  },
  infoDesc:{
    fontSize: 22
  },
  infoInput:{
    fontSize: 20,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    borderBottomColor: "black"
  },
  btnCont:{
    position: "relative",
    alignItems: "flex-end",
    height: "20%",
    gap: 20
  },
  saveBtnCont:{
    width: "100%",
    paddingHorizontal: 20
  },
  saveDetailsBtn:{
    backgroundColor: "#2883D4",
    padding: 10,
    alignItems: "center",
  },
  saveDetailsBtnTxt:{
    color: "#FAF9F6",
    fontWeight: "600",
    fontSize: 18,
  },
  cancelBtnCont:{
    width: "100%",
    paddingHorizontal: 20
  },
  cancelDetailsBtn:{
    backgroundColor: "#D42832",
    padding: 10,
    alignItems: "center",
  },
  cancelDetailsBtnTxt:{
    color: "#FAF9F6",
    fontWeight: "600",
    fontSize: 18,
  }
})