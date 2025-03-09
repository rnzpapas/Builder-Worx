import { LogBox, ScrollView } from 'react-native';
import { View } from '@components/Themed';
import { StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BoldModText, ExtraBoldModText, ModText } from '@/components/StyledText';
import { useCallback, useEffect, useState } from 'react';
import { FIREBASE_DB, FIREBASE_AUTH } from '@firebaseConfig';
import {get, ref} from 'firebase/database';
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
  const WORKER_SESSION = FIREBASE_AUTH.currentUser;
  const WORKER_REF = ref(FIREBASE_DB, "users/" + WORKER_SESSION?.uid);
  const WORKER_BOOKINGS_REF = ref(FIREBASE_DB, "users/" + WORKER_SESSION?.uid + "/bookings/");
  const [totalProfits, setTotalProfits] = useState(0);
  const [totalCompletedBookings, setTotalCompletedBookings] = useState(0);
  const [totalPendingBookings, setTotalPendingBookings] = useState(0);
  const [rating, setRating] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState({
    tableHead: ['Location', 'Work Date', 'Rate'],
    tableData: Array<Array<String>>()
  });

  const getTotalProfits = useCallback(async() => {
    let totalIncome = 0;
    await get(WORKER_BOOKINGS_REF)
    .then(snapshots => {
      if(snapshots.exists()){
        snapshots.forEach(snapshot => {
          if(snapshot.val().complete === true){
            totalIncome = totalIncome + (snapshot.val().price - (snapshot.val().price * 0.2));
          }
        })
        setTotalProfits(totalIncome);
      }
    })
  },[totalProfits])

  const getCompletedBookings = useCallback(async() => {
    let totalCompleted = 0;
    await get(WORKER_BOOKINGS_REF)
    .then(snapshots => {
      if(snapshots.exists()){
        snapshots.forEach((snapshot) => {
          if(snapshot.val().complete === true){
            totalCompleted++;
            setTotalCompletedBookings(totalCompleted);
          }
        })
      }
    })
  },[totalCompletedBookings])

  const getPendingBookings = useCallback(async() => {
    let totalPending = 0;
    await get(WORKER_BOOKINGS_REF)
    .then(snapshots => {
      if(snapshots.exists()){
        snapshots.forEach((snapshot) => {
          if(snapshot.val().complete === false){
            totalPending++;
            setTotalPendingBookings(totalPending);
          }
        })
      }
    })
  },[totalPendingBookings])

  const getWorkerRating = useCallback(async() => {
    await get(WORKER_REF)
    .then(snapshot => {
      if(snapshot.exists()){
        setRating(snapshot.val().rating.toFixed(1))
      }
    })
  },[rating])

  const getUpcomingBookings = useCallback(async () => {
    let bookingArr =Array<Array<String>>();
    const snapshots = await get(WORKER_BOOKINGS_REF)
    if(snapshots.exists()){
      snapshots.forEach((snapshot_a) => {
        if(snapshot_a.val().complete === false && snapshot_a.val().cancelled === false){
          let listArr = Array<String>();
          listArr.push(snapshot_a.val().location);
          listArr.push(snapshot_a.val().from);
          listArr.push(snapshot_a.val().price);
          bookingArr.push(listArr);
        }
      })
      setUpcomingBookings({
        tableHead: [...upcomingBookings.tableHead],
        tableData: bookingArr
      });
    }
  },[upcomingBookings.tableData])

  useEffect(() => {
    getTotalProfits();
    getCompletedBookings();
    getPendingBookings();
    getWorkerRating();
  },[])

  useEffect(() => {
    getUpcomingBookings();
  },[upcomingBookings])
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
          <ModText style={styles.dataContent}>Php {totalProfits.toFixed(2)}</ModText>
        </View>
        <View style={styles.dataCont}>
          <ExtraBoldModText style={styles.dataTitle}>Completed Bookings</ExtraBoldModText>
          <ModText style={styles.dataContent}>{totalCompletedBookings} out of {totalPendingBookings}</ModText>          
        </View>
        <View style={styles.dataCont}>
          <ExtraBoldModText style={styles.dataTitle}>Worker Rating</ExtraBoldModText>
          <ModText style={styles.dataContent}>{rating} / 5.0</ModText>  
        </View>
        <View style={styles.dataCont}>
          <ExtraBoldModText style={styles.dataTitle}>Upcoming Bookings</ExtraBoldModText>
          {
            upcomingBookings.tableData.length === 0 ? <ModText style={{color: "#5249D5", fontSize: 18}}> No upcoming bookings.</ModText> :
            <Table borderStyle={{borderWidth: 0}}>
              <Row data={upcomingBookings.tableHead} style={styles.head} textStyle={styles.text}/>
              <Rows data={upcomingBookings.tableData} textStyle={styles.dataText}/>
            </Table>
          }
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
