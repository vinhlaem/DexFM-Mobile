import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-gesture-handler";

interface ItemSettingProps {
    title: string;
    onPress?: () => void;
    content?: string;
    Icon?: React.ComponentType;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
}

export const ItemSetting = ({ title, onPress, content, Icon, }: ItemSettingProps) => {

    return (
        <Pressable
            style={({ pressed }) => [
                styles.itemSelectedContainer,
                {
                    // backgroundColor: pressed ? '#4c4c4c' : 'rgba(255, 255, 255, 1)'
                    transform: [{ scale: pressed ? 0.97 : 1 }]
                }
            ]}
            onPress={onPress}
        >
            {
                (Icon) &&
                <Icon />
            }
            <View>
                <Text style={styles.titleSelectedText}>{title}</Text>
                {content && <Text style={styles.contentSelectedText}>{content}</Text>}
            </View>
            <View style={styles.iconContainer}>
                <Ionicons name="chevron-forward-outline" size={24} color="black" />
            </View>
        </Pressable>
    )
}


export const ItemSettingSwitch = ({ title, onPress, content, Icon, value, onValueChange }: ItemSettingProps) => {

    return (
        <Pressable
            style={({ pressed }) => [
                styles.itemSelectedContainer,
                {
                    // backgroundColor: pressed ? '#4c4c4c' : 'rgba(255, 255, 255, 1)'
                    transform: [{ scale: pressed ? 0.97 : 1 }]
                }
            ]}
            onPress={onPress}
        >
            {
                (Icon) &&
                <Icon />
            }
            <View>
                <Text style={styles.titleSelectedText}>{title}</Text>
                {content && <Text style={styles.contentSelectedText}>{content}</Text>}
            </View>
            <View style={styles.iconContainer}>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                />
            </View>
        </Pressable>
    )
}




const styles = StyleSheet.create({
    contentSelectedText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#5a5a5a',
    },
    itemSelectedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        width: '100%',
        marginTop: 15,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        padding: 15
    },
    titleSelectedText: {
        fontSize: 16,
        fontWeight: '500',
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
