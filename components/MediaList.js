import {
    View,
    ScrollView,
    useWindowDimensions,
    StyleSheet,
} from "react-native";
import { MediaCard } from "./MediaCard";
import { useState, useEffect } from "react";
import { client, mediaQuery } from "../anilist/client";

export const MediaList = ({ planning = false }) => {
    const { scale } = useWindowDimensions();

    const [medias, setMedias] = useState([]);

    useEffect(() => {
        const fetchMedia = async () => {
            const data = await client.query({
                query: mediaQuery,
                variables: {
                    userName: "Zelak",
                    status: planning ? "PLANNING" : "CURRENT",
                },
                fetchPolicy: "network-only",
            });

            let newMedias = data.data.MediaListCollection.lists[0].entries;
            newMedias = newMedias
                .filter((resp) => {
                    if (resp.media.nextAiringEpisode) {
                        return (
                            resp.progress <
                            resp.media.nextAiringEpisode.episode - 1
                        );
                    }

                    if (resp.media.episodes === null) return true;
                    return resp.progress < resp.media.episodes;
                })
                .sort((a, b) => {
                    return b.media.popularity - a.media.popularity;
                });
            setMedias(newMedias);
        };

        // interval to fetch media every 5 minutes
        fetchMedia();
        const intervalId = setInterval(() => {
            fetchMedia();
        }, 300000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <ScrollView>
            <View style={styles.mediaCardContainer}>
                {medias.map((media) => {
                    return (
                        <MediaCard
                            key={media.media.id}
                            anime={{
                                name:
                                    media.media.title.english ||
                                    media.media.title.romaji,
                                image: media.media.coverImage.large,
                                episodes: media.media.episodes,
                                progress: media.progress,
                                nextAiringEpisode:
                                    media.media.nextAiringEpisode,
                            }}
                            scale={scale}
                        />
                    );
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mediaCardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 5,
        justifyContent: "space-evenly",
    },
});
