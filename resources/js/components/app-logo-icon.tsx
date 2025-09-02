import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/vetro-logo.png"
            alt={props.alt ?? 'Vetro logo'}
        />
    );
}
