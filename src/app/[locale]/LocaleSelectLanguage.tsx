"use client";

import { useState } from "react";
import {
  useChangeLocale,
  useCurrentLocale,
  useI18n,
} from "../../locales/client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";

import { MdOutlineTranslate } from "react-icons/md";
const TranslateIcon = MdOutlineTranslate as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const languages = [
  { code: "en", flag: "gb", name: "English-EN" },
  { code: "fr", flag: "fr", name: "Français-FR" },
  { code: "de", flag: "de", name: "Deutsch-DE" },
  { code: "es", flag: "es", name: "Español-ES" },
  { code: "it", flag: "it", name: "Italiano-IT" },
  { code: "pt", flag: "pt", name: "Português-PT" },
];

const LocaleSelectLanguage = () => {
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const t = useI18n();
  const [changingLocale, setChangingLocale] = useState<string | null>(null);

  const handleLocaleChange = (newLocale: any) => {
    setChangingLocale(newLocale);
    changeLocale(newLocale);
    setTimeout(() => setChangingLocale(null), 500);
  };

  return (
    <div className="flex justify-center w-full">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center text-gray-50 cursor-pointer">
            <TranslateIcon className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white ml-1">
              {t("currentLanguage")}
            </span>
          </div>
        </HoverCardTrigger>

        <HoverCardContent
          className="p-3 bg-white shadow-lg mt-3 border border-gray-200 rounded-lg w-max max-w-full overflow-x-auto"
          sideOffset={10}
          align="end"
          side="top"
        >
          <div className="flex gap-4">
            {languages.map(({ code, flag, name }) => (
              <div
                key={code}
                onClick={() => handleLocaleChange(code)}
                className={`flex flex-col items-center cursor-pointer transition-transform hover:scale-105 ${changingLocale === code ? "scale-95" : ""
                  }`}
              >
                <span className={`fi fi-${flag} text-xl`} />
                <span
                  className={`text-xs mt-1 text-center ${locale === code
                      ? "font-semibold text-gray-900"
                      : "text-gray-700"
                    }`}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default LocaleSelectLanguage;
