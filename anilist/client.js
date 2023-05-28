import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
    uri: "https://graphql.anilist.co",
    cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false,
    }),
});

export const nextAiringQuery = gql`
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

export const mediaQuery = gql`
    query GetUserMedia($userName: String, $status: MediaListStatus) {
        MediaListCollection(userName: $userName, status: $status, type: ANIME) {
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
