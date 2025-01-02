import React from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, Linking } from 'react-native';

interface ListSocialProps {
    website?: string;
    twitter?: string;
    telegram?: string;
    contract?: string;
    reddit?: string;
}

export default function ListSocialLink({ contract, telegram, twitter, website, reddit }: ListSocialProps) {
    const menuItems = [
        { id: '1', icon: '📺', label: 'Contract', url: contract },
        { id: '2', icon: '❤️', label: 'Website', url: website },
        { id: '3', icon: '💵', label: 'Twitter', url: twitter },
        { id: '4', icon: '🔗', label: 'Telegram', url: telegram },
        { id: '5', icon: '🔗', label: 'Reddit', url: reddit },
    ].filter((item) => item.url);

    const handlePress = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.log(`Cannot open URL: ${url}`);
        }
    };

    const renderItem = ({ item }: { item: typeof menuItems[0] }) => {

        return (
            <Pressable style={styles.menuItem} onPress={() => handlePress(item.url!)}>
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.label}>{item.label}</Text>
            </Pressable>
        )
    };

    if (menuItems.length === 0) return <></>

    return (
        <View style={styles.container}>
            {menuItems.length > 0 ? (
                <FlatList
                    data={menuItems}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <Text style={styles.emptyMessage}>No social links available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        width: '90%',
        margin: 'auto'
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F5F8',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
    },
    icon: {
        fontSize: 18,
        marginRight: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    emptyMessage: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});