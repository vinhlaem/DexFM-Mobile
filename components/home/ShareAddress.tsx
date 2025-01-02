import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomQRCode from '../QRCode';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import CustomSelector from '../Selector';
import { getLogo } from '@/utils/getLogoCrypto';
import { getNameShareAddress } from '@/utils/getNameCrypto';
import ButtonHome from '../Button';
import IconQRCode from '@/assets/svgComponents/IconQRCode';
import * as Clipboard from "expo-clipboard";

const formatAddress = (address: string) => {
    const firstPart = address.slice(0, 4);
    const lastPart = address.slice(-4);
    const middlePart = address.slice(4, -4);

    return (
        <Text>
            <Text style={styles.bold}>{firstPart}</Text>{middlePart}<Text style={styles.bold}>{lastPart}</Text>
        </Text>
    );
};

const ShareAddress: React.FC = () => {
    const ethereumAccounts = useSelector((state: RootState) => state.ethereum.addresses);
    const solanaAccounts = useSelector((state: RootState) => state.solana.addresses);

    const [selectedOption, setSelectedOption] = useState(ethereumAccounts[0]);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(selectedOption.address);
        alert('Địa chỉ đã được sao chép vào clipboard!');
    };

    return (
        <View style={styles.container}>
            <CustomSelector
                options={[...ethereumAccounts, ...solanaAccounts]}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                containerStyle={{ marginVertical: 20 }}
            />
            <CustomQRCode
                value={selectedOption.address}
                size={256}
                level="H"
                bgColor="#f0f0f0"
                fgColor="#333333"
                logo={getLogo(selectedOption.accountName)}
                logoSize={50}
            />
            <Text style={[styles.addressLabel]}>{getNameShareAddress(selectedOption.accountName)}</Text>
            <Text style={[styles.address]}>{formatAddress(selectedOption.address)}</Text>

            <ButtonHome
                icon={<IconQRCode size={25} color="white" />}
                label='Copy to clipboard'
                containerStyles={{ width: '90%', position: 'absolute', bottom: 50 }}
                onPress={() => handleCopy()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '90%',
        height: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    addressLabel: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 20,
        width: '100%',
        textAlign: 'center'
    },
    address: {
        color: '#878787',
        fontSize: 16,
        fontWeight: '400',
        width: '100%',
    },
    bold: {
        fontWeight: '600',
        color: '#454545',
    },
});

export default ShareAddress;

