import type { ReactNode } from "react";
type Props = {
  children: ReactNode;
  hasArrow?: boolean;
  isOpen?: boolean;
}
export default function NavButton({ children, isOpen, hasArrow }: Props) {
  return (
    <div className="@flex @h-full">
      <div className="@flex @items-center @text-white hover:@text-primary-light @text-2xl tablet:@text-3xl laptop:@text-xl monitor:@text-2xl @font-medium large_monitor:@text-4xl @text-center @h-full">
        {children}
      </div>
      {hasArrow == true && (
        <div
          className={`@flex @items-center @text-primary @font-mono @font-bold @text-2xl @duration-300 @px-1 @ml-2 ${
            isOpen == true && "@rotate-180 @translate-y-[-0.1rem]"
          }`}
        >
          &#x25BC;
        </div>
      )}
    </div>
  );
}
