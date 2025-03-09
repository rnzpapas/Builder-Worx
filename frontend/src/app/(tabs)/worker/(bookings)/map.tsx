import { StyleSheet, View, Dimensions, StatusBar, Platform, TextInput, PermissionsAndroid, Button, TouchableOpacity} from 'react-native';
import { Link, router, useLocalSearchParams} from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { BoldModText, MedModText, ModText } from '@/components/StyledText';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { FIREBASE_AUTH, FIREBASE_DB } from '@firebaseConfig';
import {ref as databaseRef, update } from 'firebase/database';
import GetLocation from 'react-native-get-location';
import { useEffect, useState } from 'react';

type locationDetails = {
  latitude : number,
  longitude : number,
}
export default function map() {
    const {address} = useLocalSearchParams();
    const USER = FIREBASE_AUTH.currentUser;
    const [locationTxt, setLocationTxt] = useState("");
    const [selectedLocation, setSelectedLocation] = useState({ 
      latitude : 0,
      longitude : 0,
    })

    const [isLocationMarked, setIsLocationMarked] = useState(false);

    const showLocation = async () => {
      if(address.length > 0 && typeof address !== "undefined"){
        const refLink = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA8J4pKpttnP2YJMSeMeA56uWP88B0BUHQ`;

        await fetch (refLink)
        .then(res => {
          res.json()
          .then(location => {
            setSelectedLocation({
              latitude: location.results[0].geometry.location.lat,
              longitude: location.results[0].geometry.location.lng
            })

            setLocationTxt(decodeURI(address));
          })
        }).catch(err => {
          console.error(err)
        })
      }
    }

    useEffect(() => {
      const locationLoad = showLocation();

      locationLoad.catch(err => console.error(err))
    }, [])
  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
          <Link replace style={styles.backBtn} href={"/(tabs)/worker/(bookings)/bookinghome"}>
            <AntDesign name="back" size={32} color="#FAF9F6"/>
          </Link>
          <BoldModText style={styles.title}> Location </BoldModText>
        </LinearGradient>
      </View>
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }} 
        showsUserLocation
        showsMyLocationButton
        >
        {
          
        }

        <Marker coordinate={selectedLocation}></Marker>
      </MapView>
      <ModText style={styles.locationTxt}> {locationTxt} </ModText>

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
    map:{
      width: '100%',
      height: '70%'
    },
    findMeBtn: {
      width: 150,
      height: 30
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
    locationTxt: {
      fontSize: 26
    }
})