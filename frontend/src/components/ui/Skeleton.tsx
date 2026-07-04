import { cn } from "@/lib/utils";

export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-sm bg-gradient-to-r from-[#F7F3EE] via-[#EADFCC] to-[#F7F3EE] bg-[length:300%_100%] animate-shimmer shadow-inner",
        className
      )}
      {...props}
    />
  );
}
