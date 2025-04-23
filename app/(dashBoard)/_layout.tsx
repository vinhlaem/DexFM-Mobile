import React, { useMemo } from 'react';
import IconFavorite from '@/assets/svgComponents/IconFavorite';
import IconHome from '@/assets/svgComponents/IconHome';
import IconMenuBar from '@/assets/svgComponents/IconMenuBar';
import IconPortfolio from '@/assets/svgComponents/IconPortfolio';
import Theme from '@/styles/theme';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_SIZE = Theme.fonts.sizes.title;
const FONT_SIZE = 12;

const tabs = [
    { name: 'home', label: 'Home', icon: IconHome },
    { name: 'favorite', label: 'Favorite', icon: IconFavorite },
    { name: 'portfolio', label: 'Portfolio', icon: IconPortfolio },
    { name: 'setting', label: 'Setting', icon: IconMenuBar },
];

export default function DashBoardLayout() {
    const insets = useSafeAreaInsets();
    const IOS = Platform.OS === 'ios';

    const tabScreens = useMemo(
        () =>
            tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        tabBarLabel: tab.label,
                        tabBarIcon: ({ color }) => (
                            <tab.icon color={color} size={ICON_SIZE} />
                        ),
                        tabBarLabelStyle: { fontSize: FONT_SIZE, marginTop: 5 },
                    }}
                />
            )),
        []
    );

    

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: { ...styles.container, marginBottom: IOS ? 0 : insets.bottom },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: '#B0B0B0',
                tabBarShowLabel: true,
                headerShown: false,
            }}
        >
            {tabScreens}
        </Tabs>
    );
}

const styles = StyleSheet.create({
    container: {
        boxShadow: '1px 0 2px 2px rgba(38, 38, 38, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderTopWidth: 0,
        height: 70,
        alignItems: 'center'
    },
});