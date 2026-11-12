import type { ReactNode } from "react";

type TPageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  actions,
}: TPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
