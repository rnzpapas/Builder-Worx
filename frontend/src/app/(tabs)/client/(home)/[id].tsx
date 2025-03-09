import { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { ModText, MedModText } from '@/components/StyledText';
import { StyleSheet, View, StatusBar, Platform, Image, FlatList, TouchableOpacity} from 'react-native';
import RoleItem from '@/components/client/RoleItem';
import StarsItem from '@/components/client/StarsItem';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE} from '@firebaseConfig';
import {ref, onValue, set, push, get, IteratedDataSnapshot} from "firebase/database";
import {ref as storageRef, getDownloadURL} from "firebase/storage";
import { AntDesign } from '@expo/vector-icons';

export default function index() {
  const USER = FIREBASE_AUTH.currentUser;
  const [imageURI, setImageURI] = useState("");
  const [userData, setUserData] = useState({
    location: "",
  });
  const [workerData, setWorkerData] = useState({
    fullname: "",
    roles: [],
    location: "",
    phoneNumber: "",
    profileImage: "",
    rating: 0,
    city: ""
  });

  const {id, fd, td} = useLocalSearchParams();

  const loadUser = () => {
    const USER_REF = ref(FIREBASE_DB, "users/" + id);
    get(USER_REF)
    .then((snapshot) => {
      if(snapshot.exists()){
        setUserData({
          location: snapshot.val().location,
        })
      }
    })
  }

  const proceedToBooking = () => {
    return router.push(`/client/book_info?id=${id}&fd=${fd}&td=${td}`);
  }

  useEffect(() => {
    loadUser();
    const USERS_REF = ref(FIREBASE_DB, "users/" + id);
    onValue(USERS_REF, (snapshots) => {
      if(snapshots.hasChildren()){
        let {fullname, roles, phoneNumber, profileImage, rating, city} = snapshots.val();
        setWorkerData({
          fullname: fullname,
          roles: roles,
          location: city,
          phoneNumber: phoneNumber,
          profileImage: profileImage,
          rating: rating,
          city: city 
        });

        const workerProfileRef = storageRef(FIREBASE_STORAGE, "/profilePictures/" + profileImage);

        getDownloadURL(workerProfileRef)
        .then(res => {
          setImageURI(res);
        }).catch(err => {
          console.error(err);
        })
      }
    });
  },[])

  return (
    <View style={styles.container}>
      <View 
        style={styles.header}
      >
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
        </LinearGradient>
        <Link replace style={styles.backBtn} href={"/(tabs)/client/(home)/"}>
          <AntDesign name="back" size={32} color="#FAF9F6"/>
        </Link>
        <View style={styles.profileImageContainer}>
          <Image 
            style={styles.profileImage}
            source={imageURI.length === 0 ? require("@assets/images/resources/02/default_worker.png") : {uri: imageURI}}
          />
        </View>
      </View>
      <View style={styles.profileMainDetails}> 
        <MedModText style={styles.profileName}>{workerData.fullname}</MedModText>
        <View>
          <FlatList 
            style={styles.workerRoleContainer}
            data={workerData.roles}
            renderItem={(role) => <RoleItem role={role.item} size='M'/> }
            progressViewOffset={5}
            horizontal
          />
        </View>
        <View style={{flexDirection: "row"}}>
          <StarsItem 
            count={workerData.rating}
            size='M'
          />
        </View>
      </View>
      <View style={styles.otherDetailsMainCont}>
        <View style={styles.otherDetailsCont}>
          <MedModText style={styles.otherDetailsTitle}> Location: </MedModText>
          <ModText style={styles.otherDetailsDesc}> {workerData.city} </ModText>
        </View>
      </View>
      <View style={styles.bookBtnCont}>
        <TouchableOpacity style={styles.bookWorkerBtn} activeOpacity={0.8} onPress={proceedToBooking}>
          <ModText style={styles.bookWorkerBtnTxt}> Proceed Booking </ModText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
      backgroundColor: "#F6F3F3",
      position: "relative"
  },
  header:{
    height: "30%",
    position: "relative", 
    marginBottom: 80
  },
  linearGradientBg:{
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  backBtn: {
    position: "absolute",
    top: 10,
    left: 10
  },
  profileImageContainer:{
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: -60
  },
  profileImage:{
    width: 170,
    height: 170,
    borderRadius: 200
  },
  profileMainDetails:{
    marginHorizontal: 20
  },
  workerRoleContainer:{
    display: "flex",
    flexDirection: "row",
    gap: 10,
    width: "100%"
  },
  profileName:{
    fontSize: 32,
    fontWeight: "500",
    color: "#000"
  },
  roles:{
    fontSize: 24
  },
  otherDetailsMainCont:{
    marginTop: 10,
    gap: 20
  },
  otherDetailsCont:{
    marginHorizontal: 20
  },
  otherDetailsTitle:{
    fontSize: 24
  },
  otherDetailsDesc:{
    fontSize: 24
  },
  bookBtnCont:{
    width: "100%",
    bottom: 20,
    position: "absolute"
  },
  bookWorkerBtn:{
    backgroundColor: "#2883D4",
    padding: 10,
    alignItems: "center",
    marginHorizontal: 30
  },
  bookWorkerBtnTxt:{
    color: "#FAF9F6",
    fontWeight: "600",
    fontSize: 18,
  }
})