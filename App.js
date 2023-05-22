import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
    AiringNext,
    width as AiringNextWidth,
    height as AiringNextHeight,
} from "./components/AiringNext";

export default function App() {
    const { width, scale } = useWindowDimensions();
    const maxCards = Math.floor((width * scale) / (AiringNextWidth + 15));
    const cards = [];
    for (let i = 0; i < maxCards; i++) {
        cards.push(
            <AiringNext
                key={i}
                anime={{
                    name: "Kimetsu no Yaiba: Katanakaji no",
                    url: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx145139-rRimpHGWLhym.png",
                    nextEpisode: "Ep 8: 6d 20h 28m",
                }}
                scale={scale}
            />
        );
    }

    const navbarStyle = {
        height: AiringNextHeight / scale + 20, // 20% of screen height
        backgroundColor: "#2C2C2C",
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
    };

    return (
        <View style={styles.container}>
            <View style={navbarStyle}>{cards}</View>
            {/* <Video
                source={{
                }}
                style={{ width: "100%", height: "100%" }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={true}
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
});
