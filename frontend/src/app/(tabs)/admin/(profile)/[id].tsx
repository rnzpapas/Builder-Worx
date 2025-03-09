import { useCallback, useEffect, useState } from 'react';
import { Link, router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MedModText, BoldModText } from '@/components/StyledText';
import { StyleSheet, View, Platform, StatusBar, Image, TouchableOpacity} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE} from "@firebaseConfig";
import {ref as databaseRef, child, get, update} from "firebase/database";
import {getDownloadURL, ref as storageRef, uploadBytes, deleteObject} from "firebase/storage";
import { Redirect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const USER = FIREBASE_AUTH.currentUser; 
  const DB = FIREBASE_DB;
  const [currentUser, setCurrentUser] = useState(Object); 
  const [userUID, setUserUID] = useState("");
  const [imageUri, setImageUri] = useState("https://firebasestorage.googleapis.com/v0/b/builder-worx-f1c08.appspot.com/o/default_profile.png?alt=media&token=292d6faf-08a4-456a-b148-a7e2d338eddf");
  const [uploadedImageURI, setUploadedImageURI] = useState("");

  const addImage = useCallback( async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    }).then(result => {
      if(!result.canceled){ 
        setUploadedImageURI(result.assets[0].uri)
        let imgArr = result.assets[0].uri.split("/");
        let imgName = imgArr[imgArr.length - 1];

        uploadImage(result.assets[0].uri, imgName)
        .catch((err) => {
          alert("Failed to update profile image: " + err);
        })
        
      }
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
  
    const USER_REF = databaseRef(FIREBASE_DB, "users/" + USER?.uid);
    get(USER_REF)
    .then(snapshots => {
      const oldFileName = snapshots.val().profileImage;
      const oldFileRef = storageRef(FIREBASE_STORAGE, "profilePictures/" + oldFileName);
      deleteObject(oldFileRef);
    })
    const fileRef = storageRef(FIREBASE_STORAGE, "profilePictures/" + filename);
    const result = await uploadBytes(fileRef, blob);
    update(USER_REF, {
      profileImage: filename
    });

    blob.close();
  
    return await getDownloadURL(fileRef);
  }

  const loadUser = async () => {
    if(USER !== null){
      const dbRef = databaseRef(DB);
      await get(child(dbRef, 'users/' + USER.uid))
      .then((snapshot) => {
        const userProfileImageRef = storageRef(FIREBASE_STORAGE, 'profilePictures/' + snapshot.val().profileImage );
        getDownloadURL(userProfileImageRef)
        .then(url => {
          setImageUri(url);
          setCurrentUser(snapshot.val());
          if(snapshot.key !== null ) setUserUID(snapshot.key);
        }).catch(err => {
          console.error(err)
        })
      })
      .catch((err) => {
        console.error("Unable to fetch user data.");
        console.error(err);
        router.push("/(tabs)/admin/");
      })
    }else{
      return <Redirect href={"/"}/>
    }
  }
  
  const logout = () => {
    FIREBASE_AUTH.signOut();
    router.replace("/(tabs)/")
  } 

  useEffect(() => {
    if(USER !== null){
      loadUser();
    }else{
      router.replace("/(tabs)/")
    }
  },[loadUser])


  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.linearGradientBg}
        colors={["#2883D4", "#6928D4"]}
        start={{x: 1, y: 0.5}}
        end={{x: 0, y: 1}}
      >
        <View style={styles.headerProfileContainer}>
          <View style={styles.headerProfilePicture}>
              <Image source={{uri: uploadedImageURI.length > 0 ? uploadedImageURI : imageUri}} style={styles.profileImg} /> 
              <TouchableOpacity onPress={addImage} activeOpacity={0.8} style={styles.uploadBtn}> 
                <Ionicons name="camera" size={24}  color="#F0F3F6"/>
              </TouchableOpacity>
          </View>
          <MedModText style={ styles.headerProfileName }> {currentUser.fullname} </MedModText>
        </View>
      </LinearGradient>
      <View style={styles.optionsContainer}>
        <BoldModText style={styles.optionTitle}>My Account </BoldModText>
        <View style={styles.optionsDesc}>
          <Link
            href={"/admin/profile_info"}
            style={styles.options}
          >
            Personal Information
          </Link>
          <Link 
            href={"/admin/change_password"} 
            style={styles.options}
          > 
            Change Password 
          </Link>
        </View>
      </View>
      <TouchableOpacity activeOpacity={1} style={styles.logoutContainer} onPress={logout}>
        <MedModText style={styles.logoutTxt}> Logout </MedModText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    height: "100%"
  },
  linearGradientBg:{
    height: "30%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  headerProfileContainer:{
    flexDirection: "row",
    alignItems:"center",
    marginHorizontal: 30,
    gap: 10,
    height: "100%"
  },
  headerProfilePicture:{
    backgroundColor: "transparent",
    width: 120,
    height: 120,
    alignItems: "flex-end",
  },
  profileImg:{
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  uploadBtn:{
    position: "absolute",
    bottom: 0,
    backgroundColor: "#2A2A2A",
    padding: 5,
    borderRadius: 100,
  },
  headerProfileName:{
    color: "#F0F3F6",
    flexWrap: "wrap",
    fontSize: 24
  },
  optionsContainer:{
    marginHorizontal: 20,
    marginTop: 20,
    height: "70%",
    position: "relative",
    gap: 10
  },
  optionTitle:{
    fontSize: 24,
    color: "#2A2A2A"
  },
  optionsDesc:{
    gap: 5,
  },
  options:{
    fontSize: 20,
    color: "#2A2A2A",
    fontFamily: "Karla"
  },
  logoutContainer:{
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 30
  },
  logoutTxt:{
    fontSize: 18,
    color: "#BB1717"
  }
});
