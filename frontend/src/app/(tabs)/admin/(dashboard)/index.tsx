import { LogBox, ScrollView } from 'react-native';
import { View } from '@components/Themed';
import { StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BoldModText, ExtraBoldModText, ModText } from '@/components/StyledText';
import { useCallback, useEffect, useState } from 'react';
import { FIREBASE_DB, FIREBASE_AUTH } from '@firebaseConfig';
import {DataSnapshot, IteratedDataSnapshot, get, ref} from 'firebase/database';
import { Table, Row, Rows } from 'react-native-table-component';

LogBox.ignoreAllLogs();

type Bookings = {
  book_id: string,
  from: string,
  to: string,
  location: string,
  phoneNumber: string,
  price: number
}
export default function Homecreen() {
  const USERS_REF = ref(FIREBASE_DB, "users/");
  const [totalProfits, setTotalProfits] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [clientPopulation, setClientPopulation] = useState(0);
  const [workerPopulation, setWorkerPopulation] = useState(0);
  const [totalCompletedBookings, setTotalCompletedBookings] = useState(0);
  const [rating, setRating] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState({
    tableHead: ['Location', 'Work Date', 'Rate'],
    tableData: Array<Array<String>>()
  });

  const getTotalProfits = useCallback(async() => {
    let totalIncome = 0;
    await get(USERS_REF)
    .then(snapshots => {
      if(snapshots.exists()){
        snapshots.forEach(snapshot => {
          if(snapshot.val().type === "worker"){
            let workerBookings = snapshot.val().bookings;
            for(var key in workerBookings){
              if(workerBookings.hasOwnProperty(key)){
                if(workerBookings[key].complete === true){
                  totalIncome = totalIncome + (workerBookings[key].price * 0.2);
                }
              }
            }
          }
        })
        setTotalProfits(totalIncome);
      }
    })
  },[totalProfits])

  const getUserCount = useCallback(async () => {
    await get(USERS_REF)
    .then(snapshots => {
      setUsersCount(snapshots.size);
    })
  },[usersCount])

  const getUserPopulation = useCallback(async () => {
    let workerCount = 0;
    let clientCount = 0;

    await get(USERS_REF)
    .then(snapshots => {
      if(snapshots.exists()){
        snapshots.forEach(snapshot => {
          if(snapshot.val().type === "worker") workerCount++;
          if(snapshot.val().type === "client") clientCount++;
        });

        setWorkerPopulation(workerCount);
        setClientPopulation(clientCount);
      }
    })
  },[]);

  const numberWithCommas = (price : number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    getTotalProfits();
    getUserCount();
    getUserPopulation();
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
          <BoldModText style={styles.title}> Dashboard </BoldModText>
        </LinearGradient>
      </View>
      <View style={styles.dashboard}>
        <View style={styles.dataCont}>
          <ExtraBoldModText style={styles.dataTitle}>Profits</ExtraBoldModText>
          <ModText style={styles.dataContent}>Php {numberWithCommas(totalProfits)}</ModText>
        </View>
        <View style={styles.dataCont}>
          <ExtraBoldModText style={styles.dataTitle}>Total Users</ExtraBoldModText>
          <ModText style={styles.dataContent}>{usersCount}</ModText>          
        </View>
        <View style={{alignItems:"center", justifyContent: "center", gap: 15}}>
          <ExtraBoldModText style={styles.dataTitle}>User Population</ExtraBoldModText>
          <View style={{flexDirection: "row", gap: 50}}>
            <View style={[styles.dataCont, {paddingHorizontal: 20,alignItems: "center", justifyContent: "center"}]}>
              <BoldModText style={[styles.dataTitle, {fontSize: 40}]}>Clients</BoldModText>
              <ModText style={styles.dataContent}>{(clientPopulation / (clientPopulation + workerPopulation) * 100).toFixed(0)}%</ModText>  
            </View>
            <View style={[styles.dataCont, {paddingHorizontal: 20,alignItems: "center", justifyContent: "center"}]}>
              <BoldModText style={[styles.dataTitle, {fontSize: 40}]}>Workers</BoldModText>
              <ModText style={styles.dataContent}>{(workerPopulation / (clientPopulation + workerPopulation) * 100).toFixed(0)}%</ModText>  
            </View>
          </View>
        </View>
      </View>
    </View>
  );
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
  dashboard: {
    display: "flex",
    gap: 15,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: "transparent"
  },
  dataCont: {
    backgroundColor: "#E6FFFD",
    padding: 15
  },
  dataTitle:{
    color: "#5249D5",
    fontSize: 24,
  },
  dataContent:{
    color: "#5249D5",
    fontSize: 48
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
  }
});
