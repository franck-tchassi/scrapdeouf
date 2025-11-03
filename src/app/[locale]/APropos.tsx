"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  InformationCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const APropos = () => {
  const [isOpen, setIsOpen] = useState(false);

  const aboutItems = [
    {
      name: 'Qui sommes-nous ?',
      description: 'Rencontrez l\'équipe derrière Visiloo',
      href: '/apropos/equipes',
      icon: InformationCircleIcon,
      arrow: true
    },
  ];

  return (
    <HoverCard openDelay={100} closeDelay={100} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <button className="text-sm font-medium text-white hover:text-gray-300 transition-colors px-3 py-2 rounded-md data-[state=open]:text-gray-300">
          À propos
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        className="p-3 bg-gray-800 shadow-xl border border-gray-700 rounded-lg w-[320px]"
        sideOffset={10}
        align="center"
        side="bottom"
        avoidCollisions={true}
      >
        <div className="px-3 py-2 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">À propos de Visiloo</h3>
          <p className="text-xs text-gray-400 mt-0.5">Découvrez notre mission et notre vision</p>
        </div>

        <div className="py-2">
          {aboutItems.map((item) => (
            <div
              key={item.name}
              className="group relative flex items-center gap-x-3 rounded-lg p-2 text-sm hover:bg-white/5 transition-colors"
            >
              <div className="flex size-8 flex-none items-center justify-center rounded-lg bg-gray-700/50 group-hover:bg-gray-700 transition-colors">
                <item.icon aria-hidden="true" className="size-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-auto min-w-0">
                <a
                  href={item.href}
                  className="block font-medium text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between"
                >
                  <span className="text-xs truncate">{item.name}</span>
                  {item.arrow && (
                    <ChevronRightIcon className="size-3.5 text-gray-400 group-hover:text-indigo-300 transition-colors flex-shrink-0 ml-2" />
                  )}
                  <span className="absolute inset-0" />
                </a>
                <p className="mt-0.5 text-gray-400 text-xs truncate">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default APropos;