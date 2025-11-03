"use client";

import { MapPin, Route, Layers, Eye, Users, BarChart } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { useI18n } from "@/locales/client";
 



const Features = () => {
  const t = useI18n();

  const featureItems = [
    {
      title: t("landing.header.features.subtitle_1.title"),
      href: "features/kml",
      description: t("landing.header.features.subtitle_1.description"),
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: t("landing.header.features.subtitle_2.title"),
      href: "features/visibilite",
      description: t("landing.header.features.subtitle_2.description"),
      icon: <Eye className="w-5 h-5 text-blue-500" />,
      color: "bg-purple-100",
    },
    {
      title: t("landing.header.features.subtitle_3.title"),
      href: "features/positions",
      description: t("landing.header.features.subtitle_3.description"),
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      color: "bg-green-100",
    },
    {
      title: t("landing.header.features.subtitle_4.title"),
      href: "features/clients",
      description: t("landing.header.features.subtitle_4.description"),
      icon: <Users className="w-5 h-5 text-blue-500" />,
      color: "bg-yellow-100",
    },
    {
      title: t("landing.header.features.subtitle_6.title"),
      href: "features/polylignes",
      description: t("landing.header.features.subtitle_6.description"),
      icon: <Route className="w-5 h-5 text-blue-500" />,
      color: "bg-indigo-100",
    },
  ];
  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="px-3 py-2  hover:bg-gray-100 transition-colors  cursor-pointer text-sm font-medium text-gray-800">
          {t("landing.header.features.title")}
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-[500px] lg:w-[600px] p-4 relative shadow-lg mt-4 border border-gray-200 rounded-lg bg-white"
        sideOffset={1}
        align="center"
        side="bottom"
      >
        {/* Triangle pointu */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white border-t border-l border-gray-200 z-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {featureItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className={`flex items-start p-4 rounded-lg transition-all hover:shadow-md ${item.color} hover:bg-opacity-80`}
            >
              <div className="mr-4 mt-0.5">{item.icon}</div>
              <div>
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Features;

