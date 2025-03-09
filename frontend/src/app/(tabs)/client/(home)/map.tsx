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
    const {id, fd, td} = useLocalSearchParams();
    const USER = FIREBASE_AUTH.currentUser;
    const [locationTxt, setLocationTxt] = useState("");
    const [selectedLocation, setSelectedLocation] = useState({ 
      latitude : 0,
      longitude : 0,
    })

    const [isLocationMarked, setIsLocationMarked] = useState(false);

    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === 'granted') {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    };
    
    const getLocation = async () => {
      const result = requestLocationPermission();
      await result.then(res => {
        if (res) {
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000
          })
          .then((position) => {
            if(position){
              setSelectedLocation({
                latitude: position.latitude,
                longitude: position.longitude
              })
            }
          })
        }
      });
    };

    const markLocation = (coord : locationDetails) => {
      if(typeof coord !== 'undefined'){
        setSelectedLocation({
          latitude: coord.latitude,
          longitude: coord.longitude,
        })
        setIsLocationMarked(true);
      }
    }

    const saveLocation = () => {
      router.replace(`/(tabs)/client/(home)/book_info?id=${id}&td=${td}&fd=${fd}&lat=${selectedLocation.latitude}&long=${selectedLocation.longitude}`);
    }

    const showLocation = async () => {
      if(selectedLocation.latitude !== 0 && selectedLocation.longitude !== 0){
        const refLink = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.latitude},${selectedLocation.longitude}&key=AIzaSyA8J4pKpttnP2YJMSeMeA56uWP88B0BUHQ`
        await fetch (refLink)
        .then(res => {
          res.json()
          .then(location => {
            setLocationTxt(location.results[0].formatted_address);
          })
        }).catch(err => {
          console.error(err)
        })
      }
    }
    useEffect( () => {
      const locationData = async () => {
        await getLocation();
      } 
      
      locationData().catch(err => console.log(err))
    },[])

    useEffect(() => {
      showLocation();
    }, [selectedLocation])
  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <LinearGradient
          style={styles.linearGradientBg}
          colors={["#2883D4", "#6928D4"]}
          start={{x: 1, y: 0.5}}
          end={{x: 0, y: 1}}
        >
          <Link replace style={styles.backBtn} href={"/(tabs)/client/(home)/"}>
            <AntDesign name="back" size={32} color="#FAF9F6"/>
          </Link>
          <BoldModText style={styles.title}> Location </BoldModText>
        </LinearGradient>
      </View>
      {/* <View>
        <ModText> {id} </ModText>
        <ModText> {td} </ModText>
        <ModText> {fd} </ModText>
      </View> */}
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
        onPress={(evt) => markLocation(evt.nativeEvent.coordinate)}
        >
        {
          
        }

        <Marker coordinate={selectedLocation}></Marker>
      </MapView>
      <ModText> {locationTxt} </ModText>

      <View style={styles.bookBtnCont}>
        <TouchableOpacity onPress={saveLocation} activeOpacity={0.8} style={styles.bookWorkerBtn}> 
          <MedModText style={styles.bookWorkerBtnTxt}>Select Location</MedModText> 
        </TouchableOpacity>
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
})