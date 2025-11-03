import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BotMessageProps {
  message: string;
  botName: string;
  avatarSrc?: string;
}

const BotMessage = ({ message, botName, avatarSrc }: BotMessageProps) => {
  return (
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="h-10 w-10">
        {avatarSrc ? (
          <AvatarImage 
            src={avatarSrc} 
            alt={botName}
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="bg-transparent">
            <Image 
              src="/s-logo.png" 
              alt={botName} 
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority={false}
            />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="font-semibold text-sm text-foreground">{botName}</span>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-3 border border-border max-w-[280px] text-white">
          <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default BotMessage;