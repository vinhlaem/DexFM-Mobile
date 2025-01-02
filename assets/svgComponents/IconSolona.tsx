import { View } from 'react-native';
import Icon from '../svgs/logo/solona.svg';

type IconProps = {
    size?: number | string,
    color?: string
}

export default function IconSolona({ size = 25, color = 'black' }: IconProps) {
    return (
        <View>
            <Icon fill={color} width={size} height={size} />
        </View>
    )
}
