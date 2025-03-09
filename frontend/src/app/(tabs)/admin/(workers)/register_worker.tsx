import { Platform, StatusBar, StyleSheet, TextInput, View } from 'react-native'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '@firebaseConfig';
import { ref, set } from 'firebase/database';
import { Link } from 'expo-router';
import { BoldModText, ModText } from '@/components/StyledText';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const items = [
  { name: 'Plumber', id: 1},
  { name: 'Mason', id: 2},
  { name: 'Carpenter', id: 3},
  { name: 'Electrician', id: 4 },
  { name: 'Roofer', id: 5},
  { name: 'Glazier', id: 6},
  { name: 'Pipefitter', id: 7},
  { name: 'Boilermaker', id: 8},
  { name: 'Flooring Installer', id: 9},
  { name: 'Painter & Decorator', id: 10},
  { name: 'Laborer', id: 11},
];

export default function register_worker() {
  const [fullname, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(Array<string>);

  const getRoles = (roleIndex : Array<string>) => {
    let roles = Array<string>();
    console.log("ROLE INDICES: ", roleIndex)
    roleIndex.forEach(rindex => {
      if(rindex == items[Number(rindex) - 1]["id"].toString()) roles.push(items[Number(rindex) - 1]["name"]);
    })
    console.log(roles);
    return roles;
  }
  const registerUser = () => {
    if(fullname.length === 0 || 
      city.length === 0 ||
      phoneNumber.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0 || 
      selectedRoles.length === 0
    ) return alert("Please fill out all fields.");
    if(phoneNumber.length < 11) return alert("Please provide an 11-digit phone number");
    if(password.length < 6) return alert("The password must be more than 5 characters.");
    if(password !== confirmPassword) return alert("The passwords does not match.");

    createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
    .then((response) => {
      const userRef = ref(FIREBASE_DB, 'users/' + response.user.uid);
      let workerRoles = getRoles(selectedRoles);
      console.log("REGISTER: ", workerRoles)
      set(userRef, {
        fullname: fullname,
        city: city,
        phoneNumber: phoneNumber,
        rating: 5,
        profileImage: "",
        roles: workerRoles,
        type: "worker"
      });
      setFullName("");
      setCity("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
      setSelectedRoles([]);
      alert("Worker successfully registered.")
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
      <View style={styles.header}>
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
          <Link replace style={styles.backBtn} href={"/admin/workers"}>
            <AntDesign name="back" size={32} color="#FAF9F6" />
          </Link>
         <BoldModText style={styles.title}> Worker Registration</BoldModText>
        </LinearGradient>
      </View>
      <View style={{height: "80%", width: "90%", marginHorizontal: 20, alignItems: "center", justifyContent:"center"}}>
        <View style={styles.formContainer}> 
          <TextInput placeholder='Full Name' placeholderTextColor={"#CECECE"} style={styles.input} onChangeText={(fullname) => onChangeFullName(fullname)} value={fullname}/>
          <TextInput placeholder='City' placeholderTextColor={"#CECECE"} style={styles.input} onChangeText={(city) => onChangeCity(city)} value={city}/>
          <TextInput placeholder='Phone Number' placeholderTextColor={"#CECECE"} style={styles.input} onChangeText={(cpn) => onChangePhoneNumber(cpn)} value={phoneNumber}/>
          <View style={{backgroundColor: "transparent"}}>
            <SectionedMultiSelect
              searchPlaceholderText='e.g. Mason'
              selectText='Choose worker roles...'
              searchTextFontFamily={"Karla"}
              itemFontFamily={"Karla"}
              confirmFontFamily={"KarlaBold"}
              subItemFontFamily={"Karla"}
              items={items}
              IconRenderer={Icon}
              uniqueKey="id"
              onSelectedItemsChange={setSelectedRoles}
              styles={{
                // searchBar: styles.textInput,
                // searchTextInput: styles.textInput,'
                selectToggle: selectedRoles.length > 0 ? {display: "none"} : { backgroundColor: "transparent", borderWidth: 1, borderColor: "#818181", padding: 2,},
                toggleIcon: {backgroundColor: "#FAF9F6"},
                selectToggleText: {color: "#CECECE", fontFamily: "Karla", fontSize: 20},
                chipsWrapper: {backgroundColor: "transparent", borderWidth: 1, borderColor: "#818181", padding: 2},
                chipContainer: {backgroundColor: "#3628D4", borderColor: "transparent"},
                chipText: {color: "#FAF9F6", fontFamily: "Karla", fontWeight:"700"},
                chipIcon: {color: "#3628D4", backgroundColor: "#D9D9D9", borderRadius: 100}
              }}
              selectedItems={selectedRoles}
            />
          </View>
          <TextInput placeholder='Email' placeholderTextColor={"#CECECE"} style={styles.input} onChangeText={(email) => onChangeEmail(email)} value={email}/>
          <TextInput placeholder='Password' placeholderTextColor={"#CECECE"} secureTextEntry={true} style={styles.input} onChangeText={(pw) => onChangePassword(pw)} value={password}/>
          <TextInput placeholder='Confirm Password' placeholderTextColor={"#CECECE"} secureTextEntry={true} style={styles.input} onChangeText={(cpw) => onChangeConfirmPassword(cpw)} value={confirmPassword}/>
          <ModText style={styles.loginBtn} onPress={registerUser}> Register </ModText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    flex: 1,
  },
  header:{
    height: "20%",
  },
  linearGradientBg:{
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
  },
  title:{
    color: "#FAF9F6",
    fontSize: 28,
    fontWeight: "500",
    marginHorizontal: 10
  },
  formContainer:{
    backgroundColor: "transparent",
    gap: 10,
    width: "90%"
  },
  input:{
    fontFamily: "Karla",
    color: "#2A2A2A",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#818181",
    padding: 2,
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
  backBtn: {
    position: "absolute",
    top: 10,
    left: 10
  },
})