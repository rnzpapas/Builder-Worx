import { StyleSheet, Image} from 'react-native';

type CountProps = {
    count: number;
    size: string;
}
export default function StarsItem({count, size} : CountProps) :Array<JSX.Element>{
    let stars = [];
    for (let index = 0; index < count; index++) {
        stars.push(
            <Image source={require("@assets/images/resources/01/stars.png")} style={size === 'S' ? styles.starImage : styles.mdStarImage} key={index} />
        ) 
    }
    return stars;
}

const styles = StyleSheet.create({
    starImage: {
        width: 18,
        height: 18,
    },
    mdStarImage:{
        width: 24,
        height: 24
    }
})