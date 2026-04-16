import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const DemoNoticeBanner = () => {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      className="flex w-full items-center justify-center gap-2 rounded-none border-x-0 border-y border-sky-200 bg-sky-50 px-3 py-1.5 text-center text-sm text-sky-950 dark:border-sky-800 dark:bg-sky-950/35 dark:text-sky-100"
    >
      <Info className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      <span>{t("footer.demoNotice")}</span>
    </div>
  );
};

export default DemoNoticeBanner;
