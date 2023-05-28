import { StyleSheet, View } from "react-native";

import { TopBar } from "./components/TopBar";
import { MediaList } from "./components/MediaList";

export default function App() {
    return (
        <View style={styles.container}>
            <TopBar />
            <MediaList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
});
