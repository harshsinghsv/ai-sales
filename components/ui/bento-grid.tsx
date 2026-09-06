import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-5",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: any;
  description: string;
  href?: string;
  cta?: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 md:col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl",
      "bg-[#FAF9F5] border border-[#E8E6DC] shadow-xs hover:shadow-md transition-all duration-300",
      className,
    )}
  >
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {background}
    </div>
    
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 p-6 transition-all duration-300 group-hover:-translate-y-2">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-2 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="font-serif text-xl font-bold text-[#141413]">
        {name}
      </h3>
      <p className="text-sm text-[#5E5D59] leading-relaxed">{description}</p>
    </div>

    {cta && (
      <div className="pointer-events-none z-10 flex items-center p-6 pt-0 opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-semibold text-[#D97757] flex items-center gap-1.5">
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    )}
  </div>
);
