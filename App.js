import { Platform, StyleSheet, View, TVEventHandler } from "react-native";

import { TopBar } from "./components/TopBar";
import { MediaList } from "./components/MediaList";
import { useEffect, useState, useRef } from "react";

export default function App() {
    const scrollViewRef = useRef();
    const [page, setPage] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (Platform.OS === "web") {
                window.scrollTo(0, 0);
            } else {
                scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
            }
        }, 0);
    }, [page]);

    useEffect(() => {
        // Detect platform and setup appropriate event handlers
        if (Platform.OS === "android") {
            let handler = new TVEventHandler();
            handler.enable(null, (cmp, event) => {
                if (event.eventType === "dpadRight") {
                    setPage(1);
                } else if (event.eventType === "dpadLeft") {
                    setPage(0);
                }
            });

            return () => {
                if (handler) {
                    handler.disable();
                }
            };
        } else if (Platform.OS === "web") {
            const handleKeyDown = (event) => {
                if (event.key === "ArrowRight") {
                    setPage(1);
                } else if (event.key === "ArrowLeft") {
                    setPage(0);
                }
            };

            window.addEventListener("keydown", handleKeyDown);

            // Clean up event listener on unmount
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, []);

    return (
        <View style={styles.container}>
            <TopBar />
            <MediaList scrollViewRef={scrollViewRef} planning={page == 1} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
});
