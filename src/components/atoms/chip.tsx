import React from "react";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, BadgeProps } from "@/components/atoms/badge";

export interface ChipProps extends Omit<BadgeProps, "children"> {
  /** Text (or node) shown inside the chip. */
  children: React.ReactNode;
  /** Optional icon rendered before the label. */
  icon?: React.ComponentType<{ className?: string }>;
  /** When provided, an X button is rendered that calls this on click. */
  onRemove?: () => void;
}

export function Chip({
  children,
  icon: IconComponent,
  onRemove,
  className,
  ...props
}: ChipProps) {
  return (
    <Badge
      className={cn(
        "bg-wpBlue-100 text-wpBlue hover:bg-wpBlue-100/40 font-inter font-bold text-sm",
        className
      )}
      {...props}
    >
      {IconComponent && <IconComponent className="h-6 w-6 mr-2" />}
      {children}
      {onRemove && (
        <XCircle
          className="ml-2 h-4 w-4 cursor-pointer shrink-0"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        />
      )}
    </Badge>
  );
}
