import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
    AiringNext,
    width as AiringNextWidth,
    height as AiringNextHeight,
} from "./AiringNext";
import useTimeTicker from "../hooks/useTimeTicker";
import { useEffect, useState } from "react";
import { client, nextAiringQuery } from "../anilist/client";

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
