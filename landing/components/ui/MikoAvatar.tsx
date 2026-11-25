import Image from "next/image";
import { cx } from "@/lib/cn";

export function MikoAvatar({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      alt=""
      className={cx("block rounded-[26%] object-cover", className)}
      height={size}
      src="/miko.svg"
      width={size}
    />
  );
}
