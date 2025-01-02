import Icon from '../svgs/portfolio.svg';

type IconProps = {
    size?: number | string,
    color?: string
}

export default function IconPortfolio({ size = 25, color = 'black' }: IconProps) {
    return (
        <Icon fill={color} width={size} height={size}/>
    )
}
