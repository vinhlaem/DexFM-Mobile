import Icon from '../svgs/send.svg';

type IconProps = {
    size?: number | string,
    color?: string
}

export default function IconSend({ size = 25, color = 'black' }: IconProps) {
    return (
        <Icon fill={color} width={size} height={size}/>
    )
}
