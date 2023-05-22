import { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import {
    differenceInSeconds,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
} from "date-fns";

export const width = 306;
export const height = 112;

export const AiringNext = ({ anime, scale, now }) => {
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

    const [timeRemaining, setTimeRemaining] = useState("");

    useEffect(() => {
        const targetDate = anime.timestamp * 1000; // convert the timestamp to milliseconds

        const days = differenceInDays(targetDate, now);
        const hours = differenceInHours(targetDate, now) % 24;
        const minutes = differenceInMinutes(targetDate, now) % 60;
        const seconds = differenceInSeconds(targetDate, now) % 60;

        let timeString = "";
        if (days > 0) {
            timeString += `${days}d `;
        }
        if (timeString.length > 0 || hours > 0) {
            timeString += `${hours}h `;
        }
        if (timeString.length > 0 || minutes > 0) {
            timeString += `${minutes}m `;
        }
        timeString += `${seconds}s`;
        setTimeRemaining(timeString);
    }, [anime.timestamp, now]);

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
                <Text
                    style={textStyle}
                >{`EP ${anime.nextEpisode}: ${timeRemaining}`}</Text>
            </View>
        </View>
    );
};
