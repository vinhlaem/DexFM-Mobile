import Icon from '../svgs/qrcode.svg';

type IconProps = {
    size?: number | string,
    color?: string
}

export default function IconQRCode({ size = 20, color = 'white' }: IconProps) {
    return (
        <Icon fill={color} width={size} height={size}/>
    )
}
