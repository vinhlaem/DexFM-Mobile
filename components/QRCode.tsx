import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type QRProps = {
    value: string | string[];
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    bgColor?: string;
    fgColor?: string;
    logoSize?: number;
    logo?: string;
};

const CustomQRCode: React.FC<QRProps> = ({
    value,
    size = 128,
    level = 'L',
    bgColor = '#FFFFFF',
    fgColor = '#000000',
    logoSize = 50,
    logo = ''
}) => {
    return (
        <View style={styles.container}>
            <QRCode
                value={Array.isArray(value) ? value.join('') : value}
                size={size}
                color={fgColor}
                backgroundColor={bgColor}
                ecl={level}
                logo={logo}
                logoSize={logoSize}
                logoBackgroundColor="black"
                logoMargin={4}
                logoBorderRadius={10}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#323232',
        borderRadius: 15
    },
});

export default CustomQRCode;