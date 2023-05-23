import {
    StyleSheet,
    View,
    useWindowDimensions,
    ScrollView,
} from "react-native";
import {
    AiringNext,
    width as AiringNextWidth,
    height as AiringNextHeight,
} from "./components/AiringNext";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { MediaCard } from "./components/MediaCard";
import useTimeTicker from "./hooks/useTimeTicker";

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

const mediaQuery = gql`
    query GetUserMedia($userName: String) {
        MediaListCollection(userName: $userName, status: CURRENT, type: ANIME) {
            lists {
                entries {
                    media {
                        id
                        title {
                            english
                            romaji
                        }
                        coverImage {
                            large
                        }
                        episodes
                        nextAiringEpisode {
                            episode
                        }
                        popularity
                    }
                    progress
                }
            }
        }
    }
`;

export default function App() {
    const { width, scale } = useWindowDimensions();
    const maxCards = Math.floor((width * scale) / (AiringNextWidth + 15));
    const [airingNext, setAiringNext] = useState([]);
    const [medias, setMedias] = useState([]);

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
    const now = useTimeTicker(airingNext, fetchAiringNext);

    useEffect(() => {
        const fetchMedia = async () => {
            const data = await client.query({
                query: mediaQuery,
                variables: {
                    userName: "Zelak",
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
    mediaCardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 5,
        justifyContent: "space-evenly",
    },
});
