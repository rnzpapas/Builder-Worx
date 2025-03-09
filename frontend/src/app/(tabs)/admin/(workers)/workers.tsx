import { Dimensions, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { BoldModText, ExtraBoldModText, ModText } from '@/components/StyledText';
import { Table, Row, Rows } from 'react-native-table-component';
import { FIREBASE_DB } from '@firebaseConfig';
import { get, ref } from 'firebase/database';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';

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

export default function workers() {
  const [workerName, setWorkerName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(Array<string>);
  const [workerList, setWorkerList] = useState({
    tableHead: ['Worker', 'Role'],
    tableData: Array<Array<String>>()
  });
  const onChangeWorkerName = (workerName : string) => {
    setWorkerName(workerName);
  }
  const verifyRoles = (workerRoles : Array<string>) => {
    let isRoleMatched = false;
    workerRoles.forEach(role => {
      selectedRoles.forEach((index) => {
        if(role === items[Number(index) - 1]["name"]) isRoleMatched = true;
      });
    })
    return isRoleMatched;
  }
  const redirectToWorkerRegistration = () => {
    router.push("/(tabs)/admin/(workers)/register_worker");
  }
  const formatWorkerRolesToString = (roles : Array<string>) => {
    let roleStr = "";

    roles.forEach((role, index) => {
      if(index < roles.length - 1){
        roleStr += role + ",";
      }
      if(index === roles.length - 1){
        roleStr += role;
      }
    })
    return roleStr;
  }
  const findWorker = () => {
    let workersArr = Array<Array<String>>();
    get(ref(FIREBASE_DB, "users/"))
    .then(snapshots => {
      if(snapshots.exists()){
        snapshots.forEach(snapshot => {
          if(snapshot.val().type === "worker") {
            let roleStr = formatWorkerRolesToString(snapshot.val().roles);
            if(workerName.length > 0 && snapshot.val().fullname.includes(workerName) && verifyRoles(snapshot.val().roles)){
              let workers = Array<String>();
              workers.push(snapshot.val().fullname);
              workers.push(roleStr);
              workersArr.push(workers);
            }
            if(workerName.length === 0 && verifyRoles(snapshot.val().roles)){
              let workers = Array<String>();
              workers.push(snapshot.val().fullname);
              workers.push(roleStr);
              workersArr.push(workers);
            }
            if(snapshot.val().fullname.includes(workerName) && selectedRoles.length === 0){
              let workers = Array<String>();
              workers.push(snapshot.val().fullname);
              workers.push(roleStr);
              workersArr.push(workers);
            }
          }
        });
        setWorkerList({
          tableHead: [...workerList.tableHead],
          tableData: workersArr
        })
      }
    })
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
          <View style={{gap: 15}}>
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
                  selectToggle: selectedRoles.length > 0 ? {display: "none"} : {marginHorizontal: 30, backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: "#fff", padding: 2,},
                  toggleIcon: {backgroundColor: "#FAF9F6"},
                  selectToggleText: {color: "#FAF9F6", fontFamily: "Karla", fontSize: 20},
                  chipsWrapper: {marginHorizontal: 30, backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: "#fff", padding: 2},
                  chipContainer: {backgroundColor: "#3628D4", borderColor: "transparent"},
                  chipText: {color: "#FAF9F6", fontFamily: "Karla", fontWeight:"700"},
                  chipIcon: {color: "#3628D4", backgroundColor: "#D9D9D9", borderRadius: 100}
                }}
                selectedItems={selectedRoles}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder='Full Name' placeholderTextColor={"#DDD5D5"} style={styles.input} onChangeText={(workerName) => onChangeWorkerName(workerName)}/>
            </View>
            <TouchableOpacity style={styles.findWorkerBtn} activeOpacity={0.8} onPress={findWorker}>
              <ModText style={styles.findWorkerBtnTxt}> Find Worker </ModText>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.dataCont}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <ExtraBoldModText style={styles.dataTitle}> Workers </ExtraBoldModText>
          <TouchableOpacity onPress={redirectToWorkerRegistration} activeOpacity={0.8} style={{flexDirection: "row", backgroundColor: "#5249D5", paddingVertical: 5, paddingHorizontal: 10, alignItems:"center", justifyContent:"center"}}>
            <Entypo name="plus" size={16} color="#F0F3F6" />
            <BoldModText style={{fontSize: 16, color: "#F0F3F6"}}>Register Worker</BoldModText>
          </TouchableOpacity>
        </View>
        {
          workerList.tableData.length === 0 ? "" :
          <Table borderStyle={{borderWidth: 0}}>
            <Row data={workerList.tableHead} style={styles.head} textStyle={styles.text}/>
            <Rows data={workerList.tableData} textStyle={styles.dataText}/>
          </Table>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    backgroundColor: "#F6F3F3"
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
  findWorkerBtn:{
    backgroundColor: "#2883D4",
    padding: 10,
    marginHorizontal: 30,
    alignItems: "center"
  },
  findWorkerBtnTxt:{
    color: "#FAF9F6",
    fontWeight: "600",
    fontSize: 16,
  },
  inputContainer:{
    flexDirection: "row",
    alignItems:"center",
    backgroundColor: "transparent",
    marginHorizontal: 30,
    width: "90%"
  },
  input:{
    fontFamily: "Karla",
    color: "#FAF9F6",
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    padding: 2,
    width: "90%"
  },
  head: {
    height: 40, 
    borderWidth: 0,
  },
  text: { 
    margin: 6,
    color: "#5249D5",
    fontSize: 16,
    fontFamily: "KarlaBold",
  },
  dataText: { 
    margin: 6,
    color: "#5249D5",
    fontSize: 16,
    fontFamily: "Karla",
  },
  dataCont: {
    marginTop: 10,
    backgroundColor: "#E6FFFD",
    padding: 15
  },
  dataTitle:{
    color: "#5249D5",
    fontSize: 24,
  },
})