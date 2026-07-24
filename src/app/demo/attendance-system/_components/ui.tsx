import type { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from "react";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("rounded-lg border border-gray-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("p-4 pb-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx("font-semibold leading-none", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("p-4 pt-2", className)} {...props} />;
}

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm";

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  const variants: Record<ButtonVariant, string> = {
    default: "bg-gray-900 text-white hover:bg-gray-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-700",
  };
  const sizes: Record<ButtonSize, string> = {
    default: "h-9 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
  };
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "outline" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default" ? "bg-gray-900 text-white" : "border border-gray-300 text-gray-700",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx("text-sm font-medium text-gray-700", className)} {...props} />;
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500",
        className,
      )}
      {...props}
    />
  );
}
