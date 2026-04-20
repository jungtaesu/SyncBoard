import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white no-underline transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 no-underline transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "text-sm text-slate-400 no-underline transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

interface LinkButtonProps {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button className={joinClassNames(VARIANT_CLASS[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ children, href, variant = "primary", className }: LinkButtonProps) {
  return (
    <Link href={href} className={joinClassNames(VARIANT_CLASS[variant], className)}>
      {children}
    </Link>
  );
}
