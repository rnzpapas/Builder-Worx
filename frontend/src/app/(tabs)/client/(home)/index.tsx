import { useEffect, useState } from 'react';
import { View } from '@components/Themed';
import { MedModText, ModText } from '@/components/StyledText';
import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerEvent} from '@react-native-community/datetimepicker';
import { StyleSheet, Platform, StatusBar, TextInput, ImageBackground, TouchableOpacity, ScrollView} from 'react-native';
import WorkerItem from '@/components/client/WorkerItem';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FIREBASE_DB } from '@firebaseConfig';
import { ref, get } from 'firebase/database';
import { Worker } from '@/Types';
import { LogBox } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons as Icon } from '@expo/vector-icons';
// LogBox.ignoreAllLogs();

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
const fontRegular = {fontFamily: "Karla"};
const fontBold = {fontFamily: "KarlaBold"};

export default function Homecreen() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [workersData, setWorkersData] = useState(Array<Worker>);
  const [workerSearchStatus, setWorkerSearchStatus] = useState("")
  const [selectedRoles, setSelectedRoles] = useState(Array<string>);
  const [endContractMinDate, setEndContractMinDate] = useState(new Date());
  const [toDateDefault, setToDateDefault] = useState(new Date());

  const getStartDate = (evt: DateTimePickerEvent, selectedDate : Date | undefined) => {
    if(selectedDate != undefined){
      const currDate = selectedDate;
      setFromDate(currDate);
      let newDateObj = new Date();
      let newEndContractDate = newDateObj.setDate(currDate.getDate() + 7)
      let newEndContractDateObj = new Date(newEndContractDate);
      setEndContractMinDate(newEndContractDateObj);
    }
    setShowFromCalendar(false);
  }
  const getEndDate = (evt: DateTimePickerEvent, selectedDate : Date | undefined) => {
    if(selectedDate != undefined && selectedDate > fromDate){
      const currDate = selectedDate;
      setToDate(currDate)
    }
    setShowToCalendar(false);
  }
  const openFromCalendar = () => {
    setShowFromCalendar(true)
  }
  const openToCalendar = () => {
    setShowToCalendar(true)
  }
  const findWorker = () => {
    let tempWorkerArr = Array<Worker>();
    if (workersData.length === 0) workersData.length = 0;

    const USERS_REF = ref(FIREBASE_DB, "users/");
    const diffTime = toDate.getTime() - fromDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 *24));
    if(isSearchFieldsEmpty(selectedRoles, fromDate, toDate)){
      alert("Please fill out all fields.");
    }else if(diffDays < 7){
      alert("The minimum booking range is one week.");
    }else{
      get(USERS_REF) 
      .then(snapshots => {
        if(snapshots.exists()){
          snapshots.forEach((snapshot) => {
            if(snapshot.val().type === "worker"){
              let workerRoles = snapshot.val().roles;
              let isWorkerAvailable = verifyWorkerSchedule(snapshot.key);
              if(isWorkerAvailable){
                if(verifyRoles(workerRoles) && !tempWorkerArr.includes(snapshot.val())) tempWorkerArr.push(snapshot.val());
              }
            }
          })
          if(tempWorkerArr.length > 0 ) {
            loadSearchResults(tempWorkerArr);
            setWorkerSearchStatus("");
          }
          else{
            loadSearchResults([])
            setWorkerSearchStatus("Oops! No worker available this time.");
          }
        }
      })
      .catch(err => {
        console.error(err)
      })
    }
  }
  const loadSearchResults = (data : Array<Worker>) => {
    if(typeof(data) !== undefined) setWorkersData(data);
  }
  const isSearchFieldsEmpty = (role : Array<string>, from : Date, to : Date) => {
    if(role.length === 0 || 
      from === undefined ||
      to === undefined
    ){
      return true;
    }else{
      false
    }
  }
  const verifyWorkerSchedule = (workerId : string) => {
    let isWorkerAvailable = true;
    const WORKERS_REF = ref(FIREBASE_DB, "users/" + workerId + "/bookings");
    get(WORKERS_REF) 
    .then(snapshots => {
      if(snapshots.exists()){
        snapshots.forEach((snapshot) => {
          let fromDateArr = snapshot.val().from.split("/");
          let toDateArr = snapshot.val().to.split("/");
          let workerFromDate = new Date(fromDateArr[2], fromDateArr[0] - 1, fromDateArr[1]);
          let workerToDate = new Date(toDateArr[2], toDateArr[0] - 1, toDateArr[1]);
        
          if(fromDate >= workerFromDate && toDate <= workerToDate) isWorkerAvailable = false;
        })
      }
    })
    return isWorkerAvailable;
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

  useEffect(() => {
    // console.log(workersData)
  },[workersData])
  
  useEffect(() => {
    endContractMinDate < toDate ? 
      toDate.setDate(fromDate.getDate() + 7)
      :
      setToDate(endContractMinDate);
  },[endContractMinDate])
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.searchContainer} source={require("@assets/images/resources/01/gradient_bg.png")} resizeMode='stretch'>
        <ModText style={styles.title}> Tell us what you need</ModText>
        {/* <TextInput style={styles.textInput} placeholder='Plumber, mason, carpenter' placeholderTextColor={"#FAF9F6"} onChangeText={(role) => onChangeRole(role)}/> */}
        <View style={{backgroundColor: "transparent"}}>
          <SectionedMultiSelect
            searchPlaceholderText='e.g. Mason'
            selectText='Choose worker roles...'
            searchTextFontFamily={fontRegular}
            itemFontFamily={fontRegular}
            confirmFontFamily={fontBold}
            subItemFontFamily={fontRegular}
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
        <View style={styles.dateContainer}>
          <TouchableOpacity style={styles.dateInputContainer} activeOpacity={1} onPress={openFromCalendar}>
            <TextInput style={styles.dateInput} placeholder='mm/dd/yyyy' placeholderTextColor={"#FAF9F6"} readOnly={true} value={fromDate.toLocaleDateString()}/>
            <FontAwesome name="calendar" size={16} color="#fff" />
              {
                showFromCalendar && (
                    <DateTimePicker 
                      value={fromDate}
                      minimumDate={date} 
                      onChange={getStartDate}
                    />

                )
              } 
          </TouchableOpacity>
          <ModText style={styles.dateSeparator}> to </ModText>
          <TouchableOpacity style={styles.dateInputContainer} activeOpacity={1} onPress={openToCalendar}>
            <TextInput style={styles.dateInput} placeholder='mm/dd/yyyy' placeholderTextColor={"#FAF9F6"} readOnly={true} value={toDate.toLocaleDateString()}/>
            <FontAwesome name="calendar" size={16} color="#fff"/>
            {
              showToCalendar && (
                <DateTimePicker 
                  
                  value={endContractMinDate > toDate ? endContractMinDate : toDate}
                  minimumDate={endContractMinDate} 
                  onChange={getEndDate}
                />
              )
            } 
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.findWorkerBtn} activeOpacity={0.8} onPress={findWorker}>
          <ModText style={styles.findWorkerBtnTxt}> Find Worker </ModText>
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.workerContainer}>
          <ScrollView>
            {
            workersData.length !== 0 ? 
              workersData.map((worker, index) => (
                <View style={{backgroundColor: "transparent"}}key={index}>
                  <WorkerItem worker={worker} unique={worker.fullname} fromDate={fromDate} toDate={toDate}/> 
                </View>
              )) : <MedModText style={{fontSize: 18}}> {workerSearchStatus} </MedModText>
            }
          </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    backgroundColor: "#F6F3F3"
  },
  searchContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: "#FAF9F6",
    marginHorizontal: 20,
    marginBottom: 10
  },
  textInput:{
    marginHorizontal: 30,
    fontSize: 20,
    fontFamily: "Karla",
    color: "#FAF9F6",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    padding: 2,
  },
  dateContainer:{
    flexDirection: "row",
    alignItems:"center",
    backgroundColor: "transparent",
    marginHorizontal: 30,
    gap: 40
  },
  dateInputContainer:{
    backgroundColor: "transparent",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  dateInput:{
    fontSize: 20,
    fontFamily: "Karla",
    color: "#FAF9F6",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    padding: 2,
  },
  dateSeparator:{
    fontSize: 20,
    color: "#FAF9F6",
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
  workerContainer:{
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#F6F3F3",
  },
  workerList:{
    flexDirection:"row"
  }
});
