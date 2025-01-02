import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type THeaderProps = {
    label?: string;
    iconLeft?: React.ReactNode;
    handleLeft?: () => void;
    iconRight?: React.ReactNode;
    handleRight?: () => void;
};

const Header: React.FC<THeaderProps> = memo(({ label, iconLeft, handleLeft, iconRight, handleRight }) => {
    const router = useRouter();

    const insets = useSafeAreaInsets();
    const IOS = Platform.OS === 'ios';

    const defaultHandleLeft = useCallback(() => router.back(), [router]);

    return (
        <View style={[styles.container, { marginTop: IOS ? 0 : insets.top }]}>
            <TouchableOpacity
                onPress={handleLeft || defaultHandleLeft}
                style={[styles.iconContainer]}
            >
                {iconLeft || <Ionicons name="chevron-back-outline" size={24} color="#000" />}
            </TouchableOpacity>

            {label && <Text style={styles.label}>{label}</Text>}

            {iconRight && (
                <TouchableOpacity onPress={handleRight} style={styles.iconContainer}>
                    {iconRight}
                </TouchableOpacity>
            )}
        </View>
    );
}
);

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        width: '90%',
        // backgroundColor: 'black',
    },
    iconContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});