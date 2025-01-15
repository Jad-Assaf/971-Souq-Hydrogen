import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { cn } from "../lib/cn";
import { IconCheck } from "./icons";

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, ...props }, ref) => {
  // Generate a unique id for the checkbox
  const id = React.useId();

  return (
    <div className={cn("flex items-center space-x-2.5", className)}>
      <CheckboxPrimitive.Root
        ref={ref}
        id={id} // Set the id for the checkbox
        className={cn(
          "peer w-5 h-5 shrink-0 border ring-offset-background focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background data-[state=checked]:text-body",
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <IconCheck className="h-3 w-3" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label ? (
        <label htmlFor={id} className="cursor-pointer">
          {label}
        </label>
      ) : null}
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };