import { cx } from "@/lib/cn";

export function PreviewCard({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-label={label}
      className={cx(
        "flex h-full w-full max-w-[460px] flex-col overflow-hidden rounded-[20px] border border-[#dde6de] bg-surface font-body text-[15px] text-ink shadow-[0_30px_60px_rgba(29,41,36,0.17),0_6px_16px_rgba(29,41,36,0.07)] max-sm:rounded-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
