import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
    AiringNext,
    width as AiringNextWidth,
    height as AiringNextHeight,
} from "./components/AiringNext";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useEffect, useState } from "react";

const client = new ApolloClient({
    uri: "https://graphql.anilist.co",
    cache: new InMemoryCache(),
});

const query = gql`
    query GetNextAiring($perPage: Int) {
        Page(perPage: $perPage) {
            airingSchedules(sort: TIME, notYetAired: true) {
                airingAt
                episode
                media {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    coverImage {
                        large
                        color
                    }
                }
            }
        }
    }
`;

export default function App() {
    const { width, scale } = useWindowDimensions();
    const maxCards = Math.floor((width * scale) / (AiringNextWidth + 15));
    // const cards = [];
    const [airingNext, setAiringNext] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const resp = await client.query({
                query: query,
                variables: {
                    perPage: maxCards,
                },
            });
            setAiringNext(resp.data.Page.airingSchedules);
        }
        fetchData();
    }, [maxCards]);

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const navbarStyle = {
        height: AiringNextHeight / scale + 20, // 20% of screen height
        backgroundColor: "#2C2C2C",
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
    };

    return (
        <View style={styles.container}>
            <View style={navbarStyle}>
                {airingNext.map((airing) => {
                    return (
                        <AiringNext
                            key={airing.media.id}
                            anime={{
                                name:
                                    airing.media.title.english ||
                                    airing.media.title.romaji,
                                url: airing.media.coverImage.large,
                                nextEpisode: airing.episode,
                                timestamp: airing.airingAt,
                            }}
                            scale={scale}
                            now={now}
                        />
                    );
                })}
            </View>
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
