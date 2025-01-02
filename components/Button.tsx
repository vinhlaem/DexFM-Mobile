import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import React, { memo } from 'react';

type TButton = {
    label?: string;
    onPress?: () => void;
    icon?: React.ReactElement;
    containerStyles?: ViewStyle;
    labelStyles?: TextStyle;

};

export default memo(function Button({
    label = 'Click Me',
    onPress,
    icon,
    containerStyles = {},
    labelStyles = {}
}: TButton) {
    const pressStyle = (pressed: boolean) => ({
        transform: [{ scale: pressed ? 0.95 : 1 }],
        opacity: pressed ? 0.9 : 1,
    });

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                containerStyles, // Apply custom container styles
                pressStyle(pressed),
            ]}
            onPress={onPress}
        >
            {icon}
            {label && (
                <Text style={[styles.label, labelStyles /* Apply custom label styles */]}>
                    {label}
                </Text>
            )}
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '45%',
        height: 48,
        backgroundColor: 'rgba(43, 45, 51, 1)',
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        boxShadow: '1px 2px 10px 3px rgba(0, 0, 0, 0.1)',
    },
    label: {
        color: 'rgba(255, 255, 255, 1)',
        fontWeight: '600',
        fontSize: 17,
        marginStart: 5,
    },
});