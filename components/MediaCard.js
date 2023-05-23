import { View, Text, ImageBackground, StyleSheet } from "react-native";

export const MediaCard = ({ anime, scale }) => {
    const nextEpisode =
        anime.nextAiringEpisode?.episode == null
            ? anime.episodes ?? "?"
            : anime.nextAiringEpisode?.episode - 1;
    const color = anime.progress === 0 ? "#300FFF" : "#ED780D";

    return (
        <View
            style={[
                styles.mediaCardContainer,
                {
                    width: 150 / scale,
                    height: 200 / scale,
                    borderRadius: 0.1 * (200 / scale),
                    borderColor: color,
                },
            ]}
        >
            <ImageBackground
                source={{
                    uri: anime.image,
                }}
                style={styles.mediaCard}
            >
                <View style={[styles.mediaCardOverlay, { height: 60 / scale }]}>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                            styles.mediaCardText,
                            { fontSize: 16 / scale, height: 37 / scale },
                        ]}
                    >
                        {anime.name}
                    </Text>
                    <Text
                        style={[
                            styles.mediaCardTextEpisodes,
                            { fontSize: 20 / scale },
                        ]}
                    >
                        {anime.progress}/{nextEpisode}
                    </Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    mediaCardContainer: {
        overflow: "hidden",
        borderWidth: 2,
        marginBottom: 5,
    },
    mediaCard: {
        width: "100%",
        height: "100%",
    },
    mediaCardOverlay: {
        backgroundColor: "black",
        opacity: 0.7,
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "column",
    },
    mediaCardText: {
        paddingTop: 2,
        paddingLeft: 5,
        paddingRight: 5,
        color: "#FFFFFF",
        flex: 1,
    },
    mediaCardTextEpisodes: {
        color: "#EE6E12",
        opacity: 0.9,
        textAlign: "center",
    },
});
