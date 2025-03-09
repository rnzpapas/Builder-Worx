import { Dimensions, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BoldModText, MedModText, ModText } from '@/components/StyledText'
import { FIREBASE_DB, FIREBASE_AUTH } from '@firebaseConfig';
import {get, ref} from 'firebase/database';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

type Bookings = {
  book_id: string,
  from: string,
  to: string,
  location: string,
  phoneNumber: string,
  price: number
}
export default function bookinghome() {
  const USER_SESSION = FIREBASE_AUTH.currentUser;
  const USER_REF = ref(FIREBASE_DB, "users/");
  const [bookings, setBookings] = useState(Array<Bookings>);
  const [bookingsArr, setBookingArr] = useState(Array());
  const [workerId, setWorkerId] = useState("");

  useEffect(() => {
    let tempBookingsArr = Array();
    get(USER_REF)
    .then((snapshots) => {
      if(snapshots.exists()){
        snapshots.forEach((snapshot) => {
          if(snapshot.val().bookings !== undefined && snapshot.val().type === "worker"){
            Object.entries(snapshot.val().bookings).map((bookObj) => {
              const bookingIdNum : any = bookObj[0];
              const isBookingApproved = snapshot.val().bookings[bookingIdNum].approved;
              if(!isBookingApproved){
                tempBookingsArr.push(snapshot.val().bookings);
                setWorkerId(snapshot.key);  
              }
            })
          }
          
          // if(snapshot.val().complete === false && snapshot.val().cancelled === false){
          //   const fdtArr = snapshot.val().from.split("/");
          //   const tdtArr = snapshot.val().to.split("/");

          //   const fdt = new Date(Number(fdtArr[2]), Number(fdtArr[0]) - 1, Number(fdtArr[1]));
          //   const tdt = new Date(Number(tdtArr[2]), Number(tdtArr[0]) - 1, Number(tdtArr[1]));

          //   const TIME_DIFF = tdt.getTime() - fdt.getTime();
          //   const DAYS_DIFF = Math.round((TIME_DIFF / (1000 * 3600 * 24)) + 1);
          //   const TOTAL_WORK_RATE = 650 * DAYS_DIFF;
          //   let booking = {
          //     book_id: snapshot.key,
          //     from: snapshot.val().from,
          //     to: snapshot.val().to,
          //     location: snapshot.val().location,
          //     phoneNumber: snapshot.val().phoneNumber,
          //     price: TOTAL_WORK_RATE
          //   }
          //   if(!bookings.includes(snapshot.val())){
          //     tempBookings.push(booking);
          //   }

          // }
        })
        // setBookings(tempBookings);
        setBookingArr(tempBookingsArr);
      }
    })
    .catch((err) => console.error("There is something wrong in our server: " + err));
  },[bookings]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header} >
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
          <BoldModText style={styles.title}> Bookings </BoldModText>
        </LinearGradient>
      </View>
      <ScrollView contentContainerStyle={styles.bookingCont}>
          {
            // OLD
            // bookings.length < 1  ? <BoldModText style={{fontWeight: "600", fontSize: 24}}> No bookings yet. </BoldModText> : 
            // bookings.map((booking) => (
            //   <Link push href={`/worker/booking?id=${booking.book_id}`}  key={booking.book_id}>
            //     <View style={styles.bookingCard}>
            //       <View style={styles.bookingCardIconCont}>
            //         <MaterialIcons name="build-circle" size={60} color="#FAF9F6" />
            //       </View>
            //       <View style={styles.bookingCardDetailsCont}>
            //         <BoldModText style={styles.bookingCardTitle}>{booking.location} </BoldModText>
            //         <MedModText style={styles.bookingCardDate}>{booking.from} to {booking.to} </MedModText>
            //         <BoldModText style={styles.bookingCardPrice}>₱{booking.price.toFixed(2)} </BoldModText>
            //       </View>
            //     </View>
            //   </Link>
            // ))

            // NEW
            bookingsArr.length < 1  ? <BoldModText style={{fontWeight: "600", fontSize: 24}}> No bookings yet. </BoldModText> : 
            bookingsArr.map((booking) => (
                Object.keys(booking).map(bookId => (
                    <Link replace href={`/admin/booking?id=${bookId}&cuid=${booking[bookId].customer}&wuid=${workerId}`} key={bookId}>
                      <View style={styles.bookingCard}>
                        <View style={styles.bookingCardIconCont}>
                          <MaterialIcons name="build-circle" size={60} color="#FAF9F6" />
                        </View>
                        <View style={styles.bookingCardDetailsCont}>
                          <BoldModText style={styles.bookingCardTitle}>{booking[bookId].location} </BoldModText>
                          <MedModText style={styles.bookingCardDate}>{booking[bookId].from} to {booking[bookId].to} </MedModText>
                          <BoldModText style={styles.bookingCardPrice}>₱{booking[bookId].price.toFixed(2)} </BoldModText>
                        </View>
                      </View>
                    </Link>
                ))
            ))
          }
          {/* <Link href="/(tabs)/worker/(home)/123123" asChild>
            <View style={styles.bookingCard}>
              <View style={styles.bookingCardIconCont}>
                <MaterialIcons name="build-circle" size={60} color="#FAF9F6" />
              </View>
              <View style={styles.bookingCardDetailsCont}>
                <BoldModText style={styles.bookingCardTitle}>Diwata Pares Overload St., Brgy. Otlum, Santo Rosa, Laguna </BoldModText>
                <MedModText style={styles.bookingCardDate}>April 25, 2024 to April 30, 2024 </MedModText>
                <BoldModText style={styles.bookingCardPrice}>₱1500.00 </BoldModText>
              </View>
            </View>
          </Link> */}
      </ScrollView>
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
  bookingCont:{
    // height: "80%",
    gap: 15,
    padding: 20,
  },
  bookingCard:{
    flexDirection: "row",
    backgroundColor: "#5249D5",
    width: Dimensions.get("screen").width - 50,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    borderRadius: 10,
    padding: 10,
    gap: 10
  },
  bookingCardIconCont:{
    width: "15%",
    backgroundColor: "transparent",
    alignItems: "center"
  },
  bookingCardDetailsCont:{
    width: "85%",
    backgroundColor: "transparent",
  },
  bookingCardTitle:{
    fontSize: 18,
    color: "#FAF9F6"
  },
  bookingCardDate:{
    fontSize: 14,
    color: "#FAF9F6",
    marginBottom: 15
  },
  bookingCardPrice:{
    fontSize: 14,
    color: "#FAF9F6"
  }
})