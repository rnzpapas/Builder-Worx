import { StyleSheet, View, Dimensions, StatusBar, Platform, TextInput, TouchableOpacity, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ModText, BoldModText, ExtraBoldModText } from '@/components/StyledText';
import { Link, Redirect, router, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '@firebaseConfig';
import {ref as databaseRef, get, push, set, child} from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes} from "firebase/storage";
import { MaterialIcons } from '@expo/vector-icons';

export default function book_info() {
  const USER = FIREBASE_AUTH.currentUser;
  const [fullAddress, setFullAddress] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImageURI, setUploadedImageURI] = useState("");
  const [currentUser, setCurrentUser] = useState(Object); 
  const [evidenceFilename, setEvidenceFilename] = useState("");
  const {id, fd, td, lat, long} = useLocalSearchParams();
  const [bookingPrice, setBookingPrice] = useState(650);
  const API_KEY = 'AIzaSyA8J4pKpttnP2YJMSeMeA56uWP88B0BUHQ';
  const addImage = useCallback( async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    }).then(result => {
      if(!result.canceled){
        let imgArr = result.assets[0].uri.split("/");
        let imgName = imgArr[imgArr.length - 1];
        setUploadedImageURI(result.assets[0].uri);
        setEvidenceFilename(imgName);
      }
    }).catch(err => {
      console.log(err)
      alert(err)
    })
  },[]);

  const uploadImage = async (uri : string, filename : string) => {

    const blob  =  await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    
    const fileRef = storageRef(FIREBASE_STORAGE, "evidences/" + filename);
    const result = await uploadBytes(fileRef, blob);
    blob.close();
  }

  const deleteImage = () => {
    setUploadedImageURI("");
    setEvidenceFilename("");
  }

  const onChangeFullAddress = (address : string) => {
    setFullAddress(address)
  }

  const onChangeDescription = (desc : string) => {
    setDescription(desc)
  }

  const loadUser = async () => {
    if(USER !== null){
      const dbRef = databaseRef(FIREBASE_DB);
      await get(child(dbRef, 'users/' + USER.uid))
      .then((snapshot) => {
        setCurrentUser(snapshot.val());
      })
      .catch((err) => {
        console.error("Unable to fetch user data.");
        console.error(err);
        router.push("/(tabs)/client/");
      })
    }else{
      return <Redirect href={"/"}/>;
    }
  }
  
  const loadLocation = async () => {
    if(typeof lat !== "undefined" && typeof long !== undefined){
      const refLink = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyA8J4pKpttnP2YJMSeMeA56uWP88B0BUHQ`
      await fetch (refLink)
      .then(res => {
        res.json()
        .then(location => {
          setFullAddress(location.results[0].formatted_address);
        })
      }).catch(err => {
        console.error(err)
      })
    }
  }
  useEffect(() => {
    const fdtArr = fd.toString().split("/");
    const tdtArr = td.toString().split("/");

    const fdt = new Date(Number(fdtArr[2]), Number(fdtArr[0]) - 1, Number(fdtArr[1]));
    const tdt = new Date(Number(tdtArr[2]), Number(tdtArr[0]) - 1, Number(tdtArr[1]));

    const TIME_DIFF = tdt.getTime() - fdt.getTime();
    const DAYS_DIFF = Math.round((TIME_DIFF / (1000 * 3600 * 24)) + 1);
    const TOTAL_WORK_RATE = 650 * DAYS_DIFF;
    setBookingPrice(TOTAL_WORK_RATE);

    loadLocation();
    
  })

  useEffect(() => {
    loadUser();
  },[uploadedImageURI])
  
  const bookWorker = () => {
    if(USER != null){
      if(fullAddress.length > 0 &&
        description.length > 0 &&
        evidenceFilename.length > 0){
        const WORKER_REF = databaseRef(FIREBASE_DB, "users/" + id + "/bookings/");
        const USER_REF = databaseRef(FIREBASE_DB, "users/" + USER.uid + "/bookings/")
        const newBookingRef = push(WORKER_REF);
        const newUserBookingRef = push(USER_REF);
        const workerBookingId = newBookingRef.key;
        const clientBookingId = newUserBookingRef.key;

        const userBooking = set(newUserBookingRef, {
          approved: false,
          complete: false,
          cancelled: false,
          started: false,
          from: fd,
          to: td,
          location: fullAddress,
          description: description,
          evidence: evidenceFilename,
          price: bookingPrice,
          assignedWorkerId: id,
          bookingWorkerId: workerBookingId
        })
        .then(() => {
          set(newBookingRef, {
            approved: false,
            complete: false,
            cancelled: false,
            started: false,
            from: fd,
            to: td,
            location: fullAddress,
            description: description,
            evidence: evidenceFilename, 
            price: bookingPrice,
            customer: USER.uid,
            customerBookingId: clientBookingId
          })
          .then(() => {
            uploadImage(uploadedImageURI, evidenceFilename)
            .then(() => {
              alert("Successfully booked a worker. Redirecting to homepage...");

              setTimeout(() => {
                router.push("/client/");
              }, 2000)
            })
            .catch(err => {
              alert("Unable to upload your evidence.");
            })
          });
        })
      }else{
        alert("Please provide all required information.");
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
          <Link replace style={styles.backBtn} href={`/(tabs)/client/(home)/book_info?id=${id}&fd=${fd}&td=${td}`}>
            <AntDesign name="back" size={32} color="#FAF9F6"/>
          </Link>
          <BoldModText style={styles.title}> Booking Information </BoldModText>
        </LinearGradient>
      </View>
      <View style={styles.bookingContainer}>
        <View>
          <BoldModText style={styles.locationTitle}>{currentUser.city}</BoldModText>
          <ModText style={styles.dateTitle}>{`${fd} to ${td}`}</ModText>
        </View>
        <View style={styles.infoCont}>
          <View>
            <BoldModText style={styles.infoDesc}>Full Address: </BoldModText>
            <View style={styles.infoInputCont}>
              <TextInput readOnly style={styles.infoInput} value={fullAddress} placeholder="e.g. 18th Ave., BGC, Taguig City" onChangeText={(val) => onChangeFullAddress(val)} />
            </View>
            <View style={styles.vmapcont}>
              <Link href={`/(tabs)/client/(home)/map?id=${id}&fd=${fd}&td=${td}`} style={styles.vmaplink}> View Map </Link>
            </View>
          </View>
          <View>
            <BoldModText style={styles.infoDesc}>Work Description: </BoldModText>
            <View style={styles.infoInputCont}>
              <TextInput style={styles.textarea} placeholder="e.g. Waterproofing of veranda..." onChangeText={(val) => onChangeDescription(val)} maxLength={200} multiline={true} numberOfLines={5} />
            </View>
          </View>
          <View>
            <BoldModText style={styles.infoDesc}> Evidence: </BoldModText>
            {uploadedImageURI.length > 0 ? 
              <View style={{backgroundColor: "transparent", alignItems: "center", justifyContent: "center"}}>
                <Image 
                  style={styles.profileImage}
                  source={{uri: uploadedImageURI}}
                />
                <TouchableOpacity onPress={deleteImage} activeOpacity={0.8} style={styles.uploadBtn}> 
                  <MaterialIcons name="cancel" size={32} color="black" />
                </TouchableOpacity>
              </View> 
              :
              <TouchableOpacity style={styles.uploadImgBtnCont} onPress={addImage}>
                <MaterialCommunityIcons name="upload" size={48} color="#2A2A2A"/>
              </TouchableOpacity>
            }
          </View>
          <View>
            <ExtraBoldModText style={{fontSize: 20}}>Total:</ExtraBoldModText>
            <BoldModText style={{fontSize: 20}}>₱{bookingPrice.toFixed(2)}</BoldModText>
          </View>
          <View style={styles.bookBtnCont}>
            <TouchableOpacity style={styles.bookWorkerBtn} activeOpacity={0.8} onPress={bookWorker}>
              <ModText style={styles.bookWorkerBtnTxt}> Book Worker </ModText>
            </TouchableOpacity>
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
    fontSize: 22,
    color: "#2A2A2A"
  },
  infoInputCont:{
    flexDirection: "row",
  },
  infoInput:{
    width: "100%",
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    color: "#2A2A2A"
  },
  vmapcont:{
    display: "flex",
    alignItems: "flex-end",
    marginTop: 2
  },
  vmaplink:{
    color: '#2883D4'
  },
  textarea:{
    width: "100%",
    fontSize: 20,
    borderWidth: 1,
    textAlignVertical: "top", 
    textAlign: "left",
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
    width: "100%",
    marginTop: 20
  },
  bookWorkerBtn:{
    backgroundColor: "#2883D4",
    padding: 10,
    alignItems: "center",
    marginHorizontal: 10
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