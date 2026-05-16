import { Card } from "@/components/ui/card";
import { Apple, CreditCard, Smartphone, Wallet as WalletIcon, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Brand = "applepay" | "googlepay" | "card" | "bank";

const brandStyle: Record<Brand, string> = {
  applepay: "bg-gradient-to-br from-zinc-900 to-black text-white",
  googlepay: "bg-gradient-to-br from-zinc-100 to-white text-zinc-900 border",
  card: "bg-gradient-to-br from-red-600 to-rose-800 text-white",
  bank: "bg-gradient-to-br from-blue-700 to-indigo-900 text-white",
};

const brandIcon: Record<Brand, React.ComponentType<{ className?: string }>> = {
  applepay: Apple,
  googlepay: Smartphone,
  card: CreditCard,
  bank: Building2,
};

const brandLabel: Record<Brand, string> = {
  applepay: "Apple Pay",
  googlepay: "Google Pay",
  card: "Card",
  bank: "Bank",
};

export function ApplePayCard({
  brand = "applepay",
  last4 = "4242",
  holder = "Jane Smith",
  expires = "12/29",
  className,
}: {
  brand?: Brand;
  last4?: string;
  holder?: string;
  expires?: string;
  className?: string;
}) {
  const Icon = brandIcon[brand];
  return (
    <Card
      className={cn(
        "relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl p-5 shadow-lg",
        brandStyle[brand],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-sm font-medium opacity-90">
          <WalletIcon className="h-4 w-4" />
          Airpak Wallet
        </div>
        <Icon className="h-6 w-6 opacity-90" />
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <div className="text-lg font-mono tracking-widest">
          {"•••• •••• •••• "}
          {last4}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs opacity-80">
          <span className="uppercase">{holder}</span>
          <span>{expires}</span>
        </div>
        <div className="mt-1 text-[10px] uppercase opacity-70 tracking-widest">
          {brandLabel[brand]}
        </div>
      </div>
    </Card>
  );
}

export default ApplePayCard;
