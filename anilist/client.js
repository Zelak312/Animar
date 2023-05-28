import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
    uri: "https://graphql.anilist.co",
    cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false,
    }),
});

export const mediaQuery = gql`
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
