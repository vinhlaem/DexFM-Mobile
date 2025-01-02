import Icon from '../svgs/home.svg';

type IconProps = {
    size?: number | string,
    color?: string
}

export default function IconHome({ size = 25, color = 'black' }: IconProps) {
    return (
        <Icon fill={color} width={size} height={size}/>
    )
}
