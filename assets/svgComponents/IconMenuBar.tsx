import Icon from '../svgs/menubar.svg';

type IconProps = {
    size?: number | string,
    color?: string
}

export default function IconMenuBar({ size = 25, color = 'black' }: IconProps) {
    return (
        <Icon fill={color} width={size} height={size}/>
    )
}
