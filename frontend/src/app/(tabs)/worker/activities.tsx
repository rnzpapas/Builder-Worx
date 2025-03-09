import { StyleSheet, View, Platform, StatusBar, TouchableOpacity, Dimensions, ScrollView, RefreshControl } from 'react-native'
import { ref, onValue, IteratedDataSnapshot, child, get } from "firebase/database";
import { ModText, MedModText, BoldModText } from '@/components/StyledText'
import { useCallback, useEffect, useState } from 'react'
import { FIREBASE_DB, FIREBASE_AUTH} from '@firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient'

type Booking = {
  bookingId: string;
  createAt: string;
  from: string;
  to: string;
  price: number;
  workerId: string;
}
export default function activities() {
  const [bookingsRecent, setBookingsRecent] = useState(Array<Booking>());
  const [bookingHistory, setBookHistory] = useState(Array<Booking>());
  const [bookingSeven, setBookingSeven] = useState(Array<Booking>());
  const [bookingFourteen, setBookingFourteen] = useState(Array<Booking>());
  const [bookingThirty, setBookingThirty] = useState(Array<Booking>());
  const [activeHistoryBtn, setActiveHistoryBtn] = useState(0);
  const user = FIREBASE_AUTH.currentUser;
  const userBookingsRef = ref(FIREBASE_DB);
  const userLink = "users/" + user?.uid + "/bookings";
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadRecentBookings =  useCallback(async () => {
    let tempBooking = Array<Booking>();
    let dateNow = new Date();
    let fromDateNow = new Date();
    let dateBefore = dateNow.getDate() - 3;
    fromDateNow.setDate(dateBefore);
    await get(child(userBookingsRef, userLink))
    .then(snapshots => {
      if(snapshots.exists()){
        snapshots.forEach(( snapshot : IteratedDataSnapshot) => {
          let fromDateArr = snapshot.val().from.split("/");
          let toDateArr = snapshot.val().to.split("/");
          let fromDate = new Date(fromDateArr[2], fromDateArr[0] - 1, fromDateArr[1]);
          let toDate = new Date(toDateArr[2], toDateArr[0] - 1, toDateArr[1]);
          if(fromDate >= fromDateNow && toDate <= dateNow && snapshot.val().complete){
              if(!tempBooking.includes(snapshot.val())) tempBooking.push(snapshot.val());
          }
        })
        setBookingsRecent(tempBooking);
      }
    })
    .catch(err => {
      console.error(err)
    })

  },[]);

  const loadSevenDaysHistory = useCallback(async () => {
    let tempBookingSeven = Array<Booking>();
    let dateNow = new Date();
    let fromDateNow = new Date();
    let dateBefore = dateNow.getDate() - 7;
    fromDateNow.setDate(dateBefore);
    await get(child(userBookingsRef, userLink)) 
    .then(snapshots => {
      if(snapshots.exists())
        snapshots.forEach(( snapshot : IteratedDataSnapshot) => {
          let fromDateArr = snapshot.val().from.split("/");
          let toDateArr = snapshot.val().to.split("/");
          let fromDate = new Date(fromDateArr[2], fromDateArr[0] - 1, fromDateArr[1]);
          let toDate = new Date(toDateArr[2], toDateArr[0] - 1, toDateArr[1]);
          if(fromDate >= fromDateNow && toDate <= dateNow && snapshot.val().complete){ 
            if(!tempBookingSeven.includes(snapshot.val())) tempBookingSeven.push(snapshot.val());
          }
        })
      })
      .catch(err => {
        console.error(err)
      }) 
      setBookHistory(tempBookingSeven);
  },[]);

  const loadFourteenDaysHistory = useCallback(async () => {
    let tempBookingFourteen = Array<Booking>();
    let dateNow = new Date();
    let fromDateNow = new Date();
    let dateBefore = dateNow.getDate() - 14;
    fromDateNow.setDate(dateBefore);
    await get(child(userBookingsRef, userLink)) 
    .then(snapshots => {
      if(snapshots.exists())
        snapshots.forEach(( snapshot : IteratedDataSnapshot) => {
          let fromDateArr = snapshot.val().from.split("/");
          let toDateArr = snapshot.val().to.split("/");
          let fromDate = new Date(fromDateArr[2], fromDateArr[0] - 1, fromDateArr[1]);
          let toDate = new Date(toDateArr[2], toDateArr[0] - 1, toDateArr[1]);
          if(fromDate >= fromDateNow && toDate <= dateNow && snapshot.val().complete){
              if(!tempBookingFourteen.includes(snapshot.val())) tempBookingFourteen.push(snapshot.val());
          }
        })
      })
      .catch(err => {
        console.error(err);
      })
      setBookHistory(tempBookingFourteen);
  },[]);

  const loadThirtyDaysHistory = useCallback(async () => {
    let tempBookingThirty = Array<Booking>();
    let dateNow = new Date();
    let fromDateNow = new Date();
    let dateBefore = dateNow.getDate() - 30;
    fromDateNow.setDate(dateBefore);
    await get(child(userBookingsRef, userLink))
    .then(snapshots => {
      if(snapshots.exists())
        snapshots.forEach(( snapshot : IteratedDataSnapshot) => {
          let fromDateArr = snapshot.val().from.split("/");
          let toDateArr = snapshot.val().to.split("/");
          let fromDate = new Date(fromDateArr[2], fromDateArr[0] - 1, fromDateArr[1]);
          let toDate = new Date(toDateArr[2], toDateArr[0] - 1, toDateArr[1]);
          if(fromDate >= fromDateNow && toDate <= dateNow && snapshot.val().complete){
            if(!tempBookingThirty.includes(snapshot.val())) tempBookingThirty.push(snapshot.val());
          }
        })
      })
      .catch(err => {
        console.error(err);
      })
      setBookHistory(tempBookingThirty);
  },[]);

  const changeHistoryTab = (index : number) => {
    setActiveHistoryBtn(index);

    if(index === 0) loadSevenDaysHistory();
    else if(index === 1) loadFourteenDaysHistory();
    else if(index === 2) loadThirtyDaysHistory();
  }

  const loadBookingHistory = () => {
    // if(bookingHistory.length === 0) bookingHistory.length = 0;
    if(activeHistoryBtn === 0) setBookHistory(bookingSeven);
    if(activeHistoryBtn === 1) setBookHistory(bookingFourteen); 
    if(activeHistoryBtn === 2) setBookHistory(bookingThirty); 
  }

  useEffect(() => {
    if(bookingsRecent.length === 0 && bookingSeven.length === 0){
      loadRecentBookings();
      loadSevenDaysHistory();
    }
  }, [refreshing, loadRecentBookings, loadSevenDaysHistory])

  // useEffect(() => {
  //   loadBookingHistory();
  // }, [activeHistoryBtn])

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{backgroundColor: "black"}}  />}>
      <View style={styles.header} >
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
          <BoldModText style={styles.title}> Activities </BoldModText>
        </LinearGradient>
      </View>
      <View style={styles.bookingContainer}>
        <View style={styles.containers}>
          <BoldModText style={styles.bookingTitle}> Recent </BoldModText>
          <ScrollView>
            {
              bookingsRecent.length === 0 ? <ModText> No recent bookings. </ModText>  : bookingsRecent.map((bookingObj, index) => (
                  <View style={styles.contentContainer} key={index}>
                    <View style={styles.bookingDetailsCont}>
                      <ModText style={styles.recentDesc}> Book a worker on {bookingObj.from} to {bookingObj.to} </ModText>
                      <ModText style={styles.recentDate}> {bookingObj.createAt} </ModText>
                    </View>
                    <BoldModText style={styles.recentPrice}> ₱{bookingObj.price.toFixed(2)} </BoldModText>
                  </View>
              ))
            }
          </ScrollView>
        </View>
        <View style={styles.containers}>
          <BoldModText style={styles.bookingTitle}> History </BoldModText>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={activeHistoryBtn === 0 ? styles.historyBtn: styles.historyBtnInactive}
              activeOpacity={activeHistoryBtn === 0 ? 0.5 : 1}
              onPress={() => changeHistoryTab(0)}
            > 
              <MedModText style={styles.historyBtnTxt}> Last 7 days ago </MedModText>
            </TouchableOpacity>
            <TouchableOpacity
              style={activeHistoryBtn === 1 ? styles.historyBtn: styles.historyBtnInactive}
              activeOpacity={activeHistoryBtn === 1 ? 0.5 : 1}
              onPress={() => changeHistoryTab(1)}
            > 
              <MedModText style={styles.historyBtnTxt}> Last 14 days ago </MedModText>
            </TouchableOpacity>
            <TouchableOpacity
              style={activeHistoryBtn === 2 ? styles.historyBtn: styles.historyBtnInactive}
              activeOpacity={activeHistoryBtn === 2 ? 0.5 : 1}
              onPress={() => changeHistoryTab(2)}
            > 
              <MedModText style={styles.historyBtnTxt}> Last 30 days ago </MedModText>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {
              bookingHistory.length === 0  ? <ModText> No booking history. </ModText> : bookingHistory.map((booking, index) => (
                <View style={styles.contentContainer} key={index}>
                  <View style={styles.bookingDetailsCont}>
                    <ModText style={styles.recentDesc}> Book a worker on {booking.from} to {booking.to} </ModText>
                    <ModText style={styles.recentDate}> {booking.createAt} </ModText>
                  </View>
                  <BoldModText style={styles.recentPrice}> ₱ {booking.price.toFixed(2)} </BoldModText>
                </View>
              ))
            }
          </ScrollView>
          {/* <View style={styles.contentContainer}>
            <View>
              <ModText style={styles.recentDesc}> Book a worker on 04/10/2024 to 04/15/2024 </ModText>
              <ModText style={styles.recentDate}> April 08, 2024 </ModText>
            </View>
            <BoldModText style={styles.recentPrice}> ₱ 1,100.00 </BoldModText>
          </View> */}
        </View>
      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    height: Dimensions.get("window").height,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
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
  title: {
    color: "#FAF9F6",
    fontSize: 28,
    fontWeight: "500",
    marginHorizontal: 10
  },
  bookingContainer:{
    height: "70%",
    marginHorizontal: 10,
    marginTop: 20
  },
  containers:{
    height: "50%",
    gap: 15
  },
  bookingDesc:{
    width: "70%"
  },
  bookingTitle: {
    width: "30%",
    fontSize: 24
  },
  contentContainer:{
    flexDirection: "row",
    marginHorizontal: 5,
    gap: 20
  },
  bookingDetailsCont:{
    width: "75%",
    flexWrap: "wrap"
  },
  recentDesc:{
    fontSize: 14
  },
  recentDate:{
    fontSize: 12,
    fontStyle: "italic"
  },
  recentPrice:{
    width: "25%",
    fontSize: 14
  },
  btnContainer:{
    flexDirection: "row",
    marginHorizontal: 5,
    gap: 10,
    marginBottom: 10
  },
  historyBtn:{
    backgroundColor: "#3628D4",
    padding: 10,
    borderRadius: 5,
  },
  historyBtnInactive:{
    backgroundColor: "rgba(54,40,212,0.5)",
    padding: 10,
    borderRadius: 5
  },
  historyBtnTxt:{
    color: "#F0F3F6",
    position: "relative",
  }
})