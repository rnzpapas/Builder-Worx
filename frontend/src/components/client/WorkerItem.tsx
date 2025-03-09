import { StyleSheet, FlatList, Image, View} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { ModText } from '../StyledText';
import { Link } from 'expo-router';
import RoleItem from './RoleItem';
import StarsItem from './StarsItem';
import { FIREBASE_DB, FIREBASE_STORAGE } from '@firebaseConfig';
import {ref, onValue} from "firebase/database";
import {ref as storageRef, getDownloadURL} from "firebase/storage";
import { useEffect, useState } from 'react';
import {Worker} from "../../Types";
type WorkerProps = {
  worker: Worker;
  unique: string,
  fromDate: Date,
  toDate: Date
}
export default function WorkerItem({ worker, unique, fromDate, toDate}: WorkerProps) {
  const [id, setId] = useState("");
  const [imageURI, setImageURI] = useState("");
  const [formatFromDate, setFormatFromDate] = useState("");
  const [formatToDate, setFormatToDate] = useState("");
  
  const loadImage = async () => {
    const workerProfileImageRef = storageRef(FIREBASE_STORAGE, "/profilePictures/" + worker.profileImage);

    await getDownloadURL(workerProfileImageRef)
    .then(res => {
      setImageURI(res);
    }).catch(err => {
      console.error(err);
    });
  };
  const loadUser = async () => {
    const USERS_REF = ref(FIREBASE_DB, "users/");
    onValue(USERS_REF, (snapshots) => {
      if(snapshots.hasChildren()){
        snapshots.forEach((snapshot) => {
          if(snapshot.val().fullname === worker.fullname){
            setId(snapshot.key);
          }
        })
      }
    });
  }
  useEffect(() => {
    loadUser();
    loadImage();
  }, [worker, id])

  useEffect(() => {
    setFormatFromDate(`${fromDate.getMonth() + 1}/${fromDate.getDate()}/${fromDate.getFullYear()}`);
    setFormatToDate(`${toDate.getMonth() + 1}/${toDate.getDate()}/${toDate.getFullYear()}`)
  },[])

  return (
    <Link href={`/client/${id}?fd=${formatFromDate}&td=${formatToDate}`} style={styles.workerLinkCard} key={unique}>
      <LinearGradient
        style={styles.workerCard}
        colors={["#2883D4", "#6928D4"]}
        start={{x: 1, y: 0.5}}
        end={{x: 0, y: 1}}
        key={id}
      >
        <Image source={imageURI.length > 0 ? {uri: imageURI} : require("@assets/images/resources/02/default_worker.png")} style={styles.workerImage}/>
        <ModText style={styles.workerName}>{worker.fullname}</ModText>
        <FlatList 
          style={styles.workerRolesContainer}
          data={worker.roles}
          renderItem={(role) => <RoleItem role={role.item} size='S'/> }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          progressViewOffset={5}
          horizontal
        />
        <View style={styles.starContainer}>
          <StarsItem count={worker.rating} size='S'/>
        </View>
      </LinearGradient>
    </Link>
  )
}

const styles = StyleSheet.create({
  workerLinkCard:{
    margin: 5
  },
  workerCard:{
    width: 200,
    height: 180,
    padding: 10,
    borderRadius: 20,
  },
  workerImage:{
    borderRadius: 100,
    height: 80,
    aspectRatio: 1,
    alignSelf: "center"
  },
  workerName:{
    color: "#FAF9F6",
    fontSize: 18
  },
  workerRolesContainer:{
    flexDirection: "row",
    gap: 10
  },
  starContainer:{
    flexDirection: "row",
    gap: 5,
  },
})