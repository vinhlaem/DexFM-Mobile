import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';

interface SuccessComponentProps {
    title: string;
    description: string;
    onClose?: () => void;
    onViewTransaction?: () => void;
}

export default memo(function SuccessComponent({
    title = 'Success!',
    description = 'Your transaction has been completed successfully.',
    onClose,
    onViewTransaction,
}: SuccessComponentProps) {
    const confettiAnimation = useRef(new Animated.Value(0)).current;

    const startAnimation = () => {
        confettiAnimation.setValue(0);
        Animated.sequence([
            Animated.timing(confettiAnimation, {
                toValue: 1.3,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(confettiAnimation, {
                toValue: 0.7,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(confettiAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }

    useEffect(() => {
        startAnimation();
    }, []);

    return (
        <View
            style={[
                styles.container,
            ]}
        >
            {onClose && (
                <Pressable style={[styles.hiddenCloseButton, styles.center]} onPress={onClose}>
                    <Ionicons name="close" size={20} color="black" />
                </Pressable>
            )}

            <Animated.View style={[styles.iconWrapper, { opacity: confettiAnimation, transform: [{ scale: confettiAnimation }] },]}>
                <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </Animated.View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <Button
                containerStyles={styles.viewTransactionButton}
                label="View transaction"
                onPress={startAnimation}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        width: '100%',
        position: 'relative',
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#E8F5E9',
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
    viewTransactionButton: {
        backgroundColor: '#4CAF50',
        width: '90%',
        position: 'absolute',
        bottom: 20,
    },
    hiddenCloseButton: {
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