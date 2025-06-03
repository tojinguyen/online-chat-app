import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  variant?: "default" | "outline" | "glass";
  hover?: boolean;
}

export const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = "default",
  hover = false,
  className = "",
  ...props
}: CardProps) => {
  const variantStyles = {
    default: "bg-white shadow-card",
    outline: "bg-white border-2 border-slate-200",
    glass: "bg-white/70 backdrop-blur-md border border-white/20 shadow-lg",
  };

  const hoverStyle = hover
    ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    : "";

  return (
    <div
      className={`rounded-xl p-6 ${variantStyles[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
        </div>
      )}

      <div className="mb-4">{children}</div>

      {footer && <div className="pt-4 border-t border-slate-200">{footer}</div>}
    </div>
  );
};
