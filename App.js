import {
    StyleSheet,
    View,
    useWindowDimensions,
    ScrollView,
} from "react-native";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { MediaCard } from "./components/MediaCard";
import { TopBar } from "./components/TopBar";

const client = new ApolloClient({
    uri: "https://graphql.anilist.co",
    cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false,
    }),
});

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
    const { scale } = useWindowDimensions();
    const [medias, setMedias] = useState([]);

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

    return (
        <View style={styles.container}>
            <TopBar />
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
