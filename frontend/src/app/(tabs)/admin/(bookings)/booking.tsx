import { Dimensions, Image, Modal, Platform, StatusBar, StyleSheet,  TouchableOpacity,  View } from 'react-native'
import { useEffect, useState } from 'react'
import { FIREBASE_DB, FIREBASE_STORAGE } from '@firebaseConfig'
import { get, ref, update } from 'firebase/database';
import {ref as storageRef, getDownloadURL } from 'firebase/storage';
import { Link, useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { BoldModText, ModText } from '@/components/StyledText';
import ImageView from "react-native-image-viewing";

export default function booking() {
  const {id, cuid, wuid} = useLocalSearchParams();
  const BOOKING_REF = ref(FIREBASE_DB, "users/" + wuid + "/bookings/" + id);
  const [booking, setBooking] = useState({
    bookId: "",
    location: "",
    from: "",
    to: "",
    description: "",
    price: 0,
    evidence: "",
    customerBookingId: ""
  })
  const [canBeCancelled, setCanBeCancelled] = useState(false);
  const [canBeCompleted, setCanBeCompleted] = useState(false);
  const [bookingEvidenceURI, setBookingEvidenceURI] = useState([{
    uri: ""
  }]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isImageViewerActive, setIsImageViewerActive] = useState(false);

  const hideModal = () => setIsModalActive(false);
  const showModal = () => setIsModalActive(true);
  const viewImage = () => setIsImageViewerActive(true);

  const loadEvidenceImage = async (image :  string) => {
    const evidenceRef = storageRef(FIREBASE_STORAGE, "evidences/" + image)
    await getDownloadURL(evidenceRef)
    .then(res => {
      setBookingEvidenceURI([{
        uri: res
      }]);
    }).catch((err) => {
      console.error(err);
      alert("There is a trouble loading images.");
    })
  }

  const rejectBooking = () => {
    const bookingUpdate = {
      cancelled: true
    }
    update(BOOKING_REF, bookingUpdate)
    .then(() => {
      router.push("/worker/booking");
    })
  }

  const approveBooking = async () => {
    const WORKER_REF = ref(FIREBASE_DB, "users/" + wuid + "/bookings/" + booking.bookId);
    const CLIENT_REF = ref(FIREBASE_DB, "users/" + cuid + "/bookings/" + booking.customerBookingId);

    const bookingUpdate = {
      approved: true
    }
    await update(WORKER_REF, bookingUpdate)
    .then(() => update(CLIENT_REF, bookingUpdate))
    .catch((err) => alert("There is something wrong with our server123."))
    
    router.replace("/admin/");
  }

  const loadBookingInformation = async() => {
    await get(BOOKING_REF)
    .then(snapshot => {
      if(snapshot.exists() && snapshot.key !== null){
          setBooking({
            bookId: snapshot.key,
            location: snapshot.val().location,
            from: snapshot.val().from,
            to: snapshot.val().to,
            description: snapshot.val().description,
            price: snapshot.val().price.toFixed(2),
            evidence: snapshot.val().evidence,
            customerBookingId: snapshot.val().customerBookingId
          })
          loadEvidenceImage(snapshot.val().evidence);
          let currentDate = new Date;
          let bookingStartDateArr = snapshot.val().from.split("/");
          let bookingEndDateArr = snapshot.val().to.split("/");

          let startDate = new Date(bookingStartDateArr[2], bookingStartDateArr[0] - 1, bookingStartDateArr[1]);
          let endDate = new Date(bookingEndDateArr[2], bookingEndDateArr[0] - 1, bookingEndDateArr[1]);

          if(currentDate === startDate || endDate < currentDate) setCanBeCancelled(false);
          if(currentDate < startDate) setCanBeCancelled(true);
          if(!snapshot.val().approved) setCanBeCancelled(false);
          if(endDate < currentDate || currentDate === endDate && snapshot.val().approved) setCanBeCompleted(true);
      }else{ 
        router.push("/admin/");
      }

    })
  }

  useEffect(() => {
    loadBookingInformation()
    .catch(err => {
      console.error(err);
      alert("There is something wrong with our servers. Redirecting you to homepage.");
      setTimeout(() => {
        router.push("/admin/");
      },2000)
    })
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
          <Link replace style={styles.backBtn} href={"/(tabs)/admin/(bookings)/bookinghome"}>
            <AntDesign name="back" size={32} color="#FAF9F6"/>
          </Link>
          <BoldModText style={styles.title}> Booking Information </BoldModText>
        </LinearGradient>
      </View>
      <Modal
        visible = {isModalActive}
        animationType='fade'
        transparent
        style={{alignItems: "center", justifyContent: "center"}}
      > 
        <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)"}}>
          <View style={{width: "90%",backgroundColor: "#fff", padding: 20}}>
            <ModText style={{fontSize: 18, textAlign: "center"}}> Do you really want to reject this booking? </ModText>
            <View style={styles.modalBookBtnCont}>
              <TouchableOpacity style={styles.modalNormalBtn} activeOpacity={0.8} onPress={hideModal}>
                <ModText style={styles.modalNormalTxt}> Back </ModText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} activeOpacity={0.8} onPress={rejectBooking}>
                <ModText style={styles.bookWorkerBtnTxt}> Reject Booking </ModText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.bookingContainer}>
        <View>
          <BoldModText style={styles.locationTitle}>{booking.location}</BoldModText>
          <ModText style={styles.dateTitle}>{`${booking.from} to ${booking.to}`}</ModText>
        </View>
        <View style={styles.infoCont}>
          <View>
            <BoldModText style={styles.infoDesc}>Work Description: </BoldModText>
            <ModText style={styles.infoText}> {booking.description} </ModText>
          </View>
          <View>
            <BoldModText style={styles.infoDesc}>Contract Price: </BoldModText>
            <ModText style={styles.infoText}> ₱{booking.price} </ModText>
          </View>
          <View>
            <BoldModText style={styles.infoDesc}> Evidence: </BoldModText>
            {bookingEvidenceURI[0].uri.length > 0 ? 
              <TouchableOpacity  activeOpacity={0.75} onPress={viewImage}>
                <Image 
                  style={styles.profileImage}
                  source={{uri: bookingEvidenceURI[0].uri}}
                />
              </TouchableOpacity> : ""
            }
            <ImageView
              images={bookingEvidenceURI}
              imageIndex={0}
              visible={isImageViewerActive}
              doubleTapToZoomEnabled={true}
              onRequestClose={() => setIsImageViewerActive(false)}
            />
          </View>
          <View style={[styles.bookBtnCont]}>
            <TouchableOpacity style={styles.bookWorkerBtn} activeOpacity={0.8} onPress={showModal}>
              <ModText style={styles.bookWorkerBtnTxt}> Reject Booking </ModText>
            </TouchableOpacity>
              <TouchableOpacity style={styles.bookWorkerNormalBtn} activeOpacity={0.8} onPress={approveBooking}>
                <ModText style={styles.bookWorkerBtnTxt}> Approve Booking </ModText>
              </TouchableOpacity>
          </View> 
          <View style={[styles.bookBtnCont]}>
          </View> 
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    height: Dimensions.get("window").height,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
  },
  header:{
    height: "15%",
  },
  linearGradientBg:{
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 5,
    left: 10
  },
  title: {
    color: "#FAF9F6",
    fontSize: 28,
    fontWeight: "500",
    marginHorizontal: 10
  },
  bookingContainer:{
    height: "100%",
    marginHorizontal: 10,
    marginTop: 20
  },
  infoCont:{
    height: "70%",
    paddingTop: 20,
    gap: 20,
  },
  infoDesc:{
    fontSize: 28,
    color: "#2A2A2A"
  },
  infoInputCont:{
    flexDirection: "row",
  },
  infoText:{
    width: "100%",
    fontSize: 24,
    color: "#2A2A2A"
  },
  locationTitle:{
    fontSize: 40,
    color: "#2A2A2A"
  },
  dateTitle:{
    fontStyle: "italic",
    fontSize: 20,
    color: "#2A2A2A"
  },
  uploadImgBtnCont:{
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 150,
    backgroundColor: "#EDEDED"
  },
  profileImageContainer:{
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: -60
  },
  profileImage:{
    width: 150,
    height: 150,
    borderRadius: 20
  },
  bookBtnCont:{
    flexDirection: 'row',
    justifyContent: 'center',
    width: "100%",
    marginTop: 20
  },
  modalBookBtnCont:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    gap: 15
  },
  bookWorkerNormalBtn:{
    backgroundColor: "#2883D4",
    padding: 10,
    alignItems: "center",
    marginHorizontal: 10
  },
  bookWorkerBtn:{
    backgroundColor: "#D42832",
    padding: 10,
    alignItems: "center",
    marginHorizontal: 10
  },
  modalBtn:{
    borderWidth: 3,
    borderColor: "#D42832",
    backgroundColor: "#D42832",
    padding: 10,
    alignItems: "center",
  },
  modalNormalBtn:{
    borderWidth: 3,
    borderColor: "#2883D4",
    padding: 10,
  },
  modalNormalTxt:{
    color: "#2A2A2A",
    fontSize: 18,
    fontWeight: "600",
  },
  bookWorkerBtnTxt:{
    color: "#FAF9F6",
    fontWeight: "600",
    fontSize: 18,
  },
  uploadBtn:{
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 100,
  },
})