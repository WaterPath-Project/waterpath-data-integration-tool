import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("test");
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <span className="font-inter text-lg">{t("inter")}</span>
      <span className="font-outfit text-lg">{t("outfit")}</span>
    </div>
  );
}
