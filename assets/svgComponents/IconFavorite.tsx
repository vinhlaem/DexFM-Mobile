import Icon from '../svgs/favorite.svg';

type IconProps = {
    size?: number | string,
    color?: string
}

export default function IconFavorite({ size = 25, color = 'black' }: IconProps) {
    return (
        <Icon fill={color} width={size} height={size}/>
    )
}
