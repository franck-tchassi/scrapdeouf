"use client";


import React, { useState } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import ChatbotWidget from "@/components/WhatsAppChat";

export default function ChatbotClientWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-6  right-6 z-50 flex flex-col items-end gap-2">
      {isChatOpen && (
        <ChatbotWidget   />
      )}
      <Button
        className={`
    rounded-full shadow-xl w-14 h-14 bg-amber-600
    flex items-center justify-center text-white
    transition
    hover:bg-amber-700
    focus:bg-amber-700
    active:bg-amber-800
    focus:ring-0 focus:outline-none
    border-none
    ${isChatOpen ? "border-4 border-amber-400" : ""}
  `}
        size="icon"
        aria-label={isChatOpen ? "Fermer le chatbot" : "Ouvrir le chatbot"}
        onClick={() => setIsChatOpen((open) => !open)}
        type="button"
      >
        {isChatOpen ? <ChevronDown size={32} /> : <MessageCircle size={32} />}
      </Button>
    </div>
  );
}