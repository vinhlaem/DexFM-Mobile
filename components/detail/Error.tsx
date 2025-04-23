import React, { memo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';

interface ErrorComponentProps {
    title: string;
    description: string;
    onRetry?: () => void;
    onClose?: () => void;
}

export default memo(function ErrorComponent({
    title = 'Error',
    description = 'Something went wrong',
    onRetry,
    onClose,
}: ErrorComponentProps) {
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        // const interval = setInterval(() => {
            startShake();
        // }, 10);

        // return () => clearInterval(interval);
    }, []);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}>
            {onClose && (
                <Pressable style={[styles.hiddenBottomSheet, styles.center]} onPress={onClose}>
                    <Ionicons name="close" size={20} color="black" />
                </Pressable>
            )}

            <View style={styles.iconWrapper}>
                <Ionicons name="close" size={70} color="#ffffff" />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <Button
                containerStyles={{ backgroundColor: '#F8665A', position: 'absolute', bottom: 20, width: '90%' }}
                label='Try again'
                onPress={onRetry}
            />
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
    },
    iconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 100,
        backgroundColor: '#F8665A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 20,
    },
    hiddenBottomSheet: {
        position: 'absolute',
        top: 0,
        right: 20,
        width: 40,
        height: 40,
        boxShadow: '0px 6px 16px 0px #2B2D3314',
        borderRadius: 20,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});