import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
    AiringNext,
    width as AiringNextWidth,
    height as AiringNextHeight,
} from "./AiringNext";
import useTimeTicker from "../hooks/useTimeTicker";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useEffect, useState } from "react";

const client = new ApolloClient({
    uri: "https://graphql.anilist.co",
    cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false,
    }),
});

const nextAiringQuery = gql`
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

export const TopBar = () => {
    const { width, scale } = useWindowDimensions();
    const maxCards = Math.floor((width * scale) / (AiringNextWidth + 15));

    const fetchAiringNext = async () => {
        const data = await client.query({
            query: nextAiringQuery,
            variables: {
                perPage: maxCards,
            },
            fetchPolicy: "network-only",
        });
        const newAiringNext = data.data.Page.airingSchedules;
        setAiringNext(newAiringNext);
    };

    useEffect(() => {
        fetchAiringNext();
    }, [maxCards]);

    const [airingNext, setAiringNext] = useState([]);
    const now = useTimeTicker(airingNext, fetchAiringNext);

    return (
        <View
            style={[
                styles.navbarStyle,
                { height: AiringNextHeight / scale + 20 },
            ]}
        >
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
    );
};

const styles = StyleSheet.create({
    navbarStyle: {
        backgroundColor: "#2C2C2C",
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
    },
});
