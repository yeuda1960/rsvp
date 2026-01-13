import { useEffect, useRef } from "react";
import lottie from "lottie-web";

type LottiePlayerProps = {
    src: string;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    style?: React.CSSProperties;
    rendererSettings?: any;
};

export function LottiePlayer({
    src,
    loop = true,
    autoplay = true,
    className,
    style,
    rendererSettings,
}: LottiePlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up previous instance
        if (animationRef.current) {
            animationRef.current.destroy();
        }

        try {
            animationRef.current = lottie.loadAnimation({
                container: containerRef.current,
                renderer: "svg",
                loop,
                autoplay,
                path: src,
                rendererSettings: rendererSettings || {
                    preserveAspectRatio: "xMidYMid slice",
                },
            });
        } catch (err) {
            console.error("Failed to load Lottie animation:", err);
        }

        return () => {
            if (animationRef.current) {
                animationRef.current.destroy();
            }
        };
    }, [src, loop, autoplay, rendererSettings]);

    return <div ref={containerRef} className={className} style={style} />;
}
