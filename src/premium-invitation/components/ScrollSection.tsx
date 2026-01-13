import React, { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../utils/motion";

export function ScrollSection({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion()) {
            setVisible(true);
            return;
        }

        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setVisible(true);
                        io.disconnect();
                        break;
                    }
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={[
                "transition-all duration-700 will-change-transform",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
