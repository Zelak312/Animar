import React from "react";
import { View, Image, Text } from "react-native";

export const width = 306;
export const height = 112;

export const AiringNext = ({ anime, scale }) => {
    const cardContainerStyle = {
        flexDirection: "row",
        width: width / scale,
        height: height / scale,
        backgroundColor: "#1E1E1E",
        borderRadius: 0.15 * (height / scale),
    };

    const cardImageStyle = {
        width: 73.12 / scale,
        height: height / scale,
        borderRadius: 0.15 * (height / scale),
    };

    const contentStyle = {
        flex: 1,
        flexDirection: "column",
    };

    const textStyle = {
        color: "rgba(255, 255, 255, 0.9)",
        padding: 5,
        fontSize: 14 / scale,
    };

    return (
        <View style={cardContainerStyle}>
            <Image
                source={{
                    uri: anime.url,
                }}
                style={cardImageStyle}
            ></Image>
            <View style={contentStyle}>
                <Text style={textStyle}>{anime.name}</Text>
                <View
                    style={{
                        borderBottomColor: "#EE6E12",
                        borderBottomWidth: 1 / scale,
                    }}
                />
                <Text style={textStyle}>{anime.nextEpisode}</Text>
            </View>
        </View>
    );
};
