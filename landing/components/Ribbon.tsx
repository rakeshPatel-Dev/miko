import { Keyboard, MousePointerClick } from "lucide-react";

const items = [
  { icon: <Keyboard className="size-[17px]" />, keys: "Alt + Shift + S", label: "quick save" },
  { icon: <Keyboard className="size-[17px]" />, keys: "Alt + Shift + R", label: "quick remove" },
  { icon: <MousePointerClick className="size-[17px]" />, keys: "Right-click", label: "save or remove" },
];

export function Ribbon() {
  return (
    <div className="overflow-hidden bg-ink text-[#e3ede6]">
      <div className="mx-auto flex min-h-[58px] w-[calc(100%-72px)] max-w-[1200px] items-center justify-center gap-3 text-[13px] font-bold max-md:w-max max-md:min-w-max max-md:justify-start">
        {items.map((item, index) => (
          <span className="flex items-center gap-3" key={item.label}>
            {index > 0 && <i className="size-1 rounded-full bg-[#e3ede6]/35" />}
            <span className="inline-flex items-center gap-[7px] whitespace-nowrap">
              <span className="text-[#a4d6ba]">{item.icon}</span>
              {item.keys}
            </span>
            <b className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#a4d6ba]">
              {item.label}
            </b>
          </span>
        ))}
      </div>
    </div>
  );
}
