import React, { useState, useRef, memo } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Platform,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomImage from '../ImageCustomer';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';

type THeaderHome = {
    searchValue?: string;
    setSearch?: (value: string) => void;
    avatar?: string;
}

const HeaderHome = memo(({ }: THeaderHome) => {
    const [isSearching, setIsSearching] = useState(false);
    const inputWidth = useRef(new Animated.Value(0)).current;

    const ethAccounts = useSelector(
        (state: RootState) => state.ethereum.addresses
      );

    const insets = useSafeAreaInsets();
    const IOS = Platform.OS === 'ios';

    // const toggleSearch = () => {
    //     if (isSearching) {
    //         Animated.timing(inputWidth, {
    //             toValue: 0,
    //             duration: 300,
    //             useNativeDriver: false,
    //         }).start(() => setIsSearching(false));
    //     } else {
    //         setIsSearching(true);
    //         Animated.timing(inputWidth, {
    //             toValue: 210,
    //             duration: 300,
    //             useNativeDriver: false,
    //         }).start();
    //     }
    // };

    return (
        <View style={[styles.container, { marginTop: IOS ? 0 : insets.top }]}>
            <Pressable style={styles.iconContainer}>
                <CustomImage source={'ok'}
                    size={40}
                    address={ethAccounts[0].address}
                    avatar={true}
                    width={40}
                    height={40}
                />
            </Pressable>

    

            <TouchableOpacity style={[styles.iconContainer, styles.searchContainer]} onPress={() => router.push('/(search)')}>
                <Ionicons name="search" size={25} color="#535353" />
            </TouchableOpacity>
        </View>
    );
});

export default HeaderHome;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        width: '90%',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 45,
        height: 45
    },
    
    
    searchContainer: {
        boxShadow: '0 6px 16px 0 rgba(43, 45, 51, 0.08)',
        borderRadius: 50,
        width: 40,
        height: 40
    },
    avatar: {
        width: '100%',
        height: '100%'
    }
});