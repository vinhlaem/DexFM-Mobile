import Icon from '../svgs/faceID.svg';

type IconProps = {
    size?: number | string,
    color?: string
}

export default function IconFaceID({ size = 25, color = 'black' }: IconProps) {
    return (
        <Icon fill={color} width={size} height={size}/>
    )
}
