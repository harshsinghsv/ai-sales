import { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <span
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "inline-block bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%]",
        "animate-shiny-text bg-gradient-to-r from-transparent via-[#D97757] via-50% to-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
};
