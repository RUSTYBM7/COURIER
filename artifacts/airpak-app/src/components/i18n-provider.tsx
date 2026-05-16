import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "zh" | "ms" | "ar";

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    shipNow: "Ship Now",
    shipments: "Shipments",
    tracking: "Tracking",
    messages: "Messages",
    payments: "Payments",
    settings: "Settings",
    admin: "Admin",
    signIn: "Sign In",
    signOut: "Sign Out",
  },
  zh: {
    dashboard: "仪表板",
    shipNow: "立即发货",
    shipments: "货件",
    tracking: "追踪",
    messages: "消息",
    payments: "付款",
    settings: "设置",
    admin: "管理员",
    signIn: "登录",
    signOut: "登出",
  },
  ms: {
    dashboard: "Papan Pemuka",
    shipNow: "Hantar Sekarang",
    shipments: "Penghantaran",
    tracking: "Penjejakan",
    messages: "Mesej",
    payments: "Pembayaran",
    settings: "Tetapan",
    admin: "Admin",
    signIn: "Log Masuk",
    signOut: "Log Keluar",
  },
  ar: {
    dashboard: "لوحة القيادة",
    shipNow: "اشحن الآن",
    shipments: "الشحنات",
    tracking: "التتبع",
    messages: "الرسائل",
    payments: "المدفوعات",
    settings: "الإعدادات",
    admin: "المشرف",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
  },
};

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("airpak-lang") as Language;
    return saved || "en";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("lang", lang);
    if (lang === "ar") {
      root.setAttribute("dir", "rtl");
    } else {
      root.setAttribute("dir", "ltr");
    }
  }, [lang]);

  const value = {
    lang,
    setLang: (l: Language) => {
      localStorage.setItem("airpak-lang", l);
      setLang(l);
    },
    t: (key: string) => {
      return translations[lang]?.[key] || translations["en"]?.[key] || key;
    },
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
