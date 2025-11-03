"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";
import { IoIosChatbubbles } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BotMessage from "@/components/BotMessage";

interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function WhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Fonction pour envoyer le message via votre API
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);

    // Ajouter le message de l'utilisateur à la conversation
    const userMessage: Message = { 
      type: 'user', 
      text: message,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMessage]);

    const userMessageText = message;
    setMessage("");

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: "33656839896", // Votre numéro de test
          message: userMessageText
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Simuler une réponse du bot
        const botResponse: Message = { 
          type: 'bot', 
          text: generateBotResponse(userMessageText),
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setConversation(prev => [...prev, botResponse]);
        }, 1000);
        
      } else {
        // CORRECTION ICI : Gérer l'erreur qui peut être un objet
        const errorMessage = typeof data.error === 'object' 
          ? JSON.stringify(data.error) 
          : data.error;
        throw new Error(errorMessage || 'Erreur inconnue');
      }
    } catch (error: any) {
      console.error('Erreur envoi message:', error);
      const errorMessage: Message = { 
        type: 'bot', 
        text: `Désolé, une erreur s'est produite: ${error.message}`,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour générer des réponses automatiques
  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
      return "👋 Bonjour ! Merci pour votre message. Nous vous répondrons par email très rapidement !";
    } else if (lowerMessage.includes('prix') || lowerMessage.includes('tarif')) {
      return "Merci pour votre demande de tarifs ! Un conseiller vous contactera par email avec nos prix détaillés.";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('tel')) {
      return "Nous avons bien noté votre demande de contact. Notre équipe vous recontactera rapidement !";
    } else {
      return "Merci pour votre message ! Nous avons bien reçu votre demande et nous vous répondrons par email dans les plus brefs délais.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bouton flottant */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="h-16 w-20 rounded-[2.5rem] cursor-pointer shadow-elegant hover:shadow-glow transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 rotate-12 hover:rotate-0"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-6 w-6 border-2  border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isOpen ? (
          <X className="!h-10 !w-10 transition-transform duration-500 rotate-180" />
        ) : (
          <IoIosChatbubbles className="!h-10 !w-10 transition-transform duration-500 rotate-0" />
        )}
      </Button>

      {/* Tooltip flottant */}
      {!isOpen && showTooltip && (
        <div className="absolute bottom-16 right-0 animate-in slide-in-from-bottom-2 duration-500">
          <div className="relative bg-card border border-border rounded-xl shadow-elegant px-4 py-3 min-w-[240px] max-w-[280px]">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 cursor-pointer -right-2 h-6 w-6 rounded-full bg-muted hover:bg-muted/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-center gap-3">
              <Image 
                src="/s-logo.png" 
                alt="Logo" 
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
              <p className="text-sm font-medium text-foreground leading-relaxed">
                Bonjour, une question ? Écrivez-nous ici.
              </p>
            </div>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-r border-b border-border rotate-45"></div>
          </div>
        </div>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-card rounded-2xl shadow-elegant shadow-xl overflow-hidden flex flex-col h-[500px]">
            {/* Header personnalisé */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex flex-col items-center justify-center shrink-0">
              <div className="flex items-center gap-0 mb-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white/30 text-white">
                    <Image 
                      src="/fille3.jpg" 
                      alt="Administrateur" 
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10 -ml-1">
                  <AvatarFallback className="text-white">
                    <Image 
                      src="/s-logo.png" 
                      alt="Scrapdeouf" 
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-sm text-white font-bold">Posez-moi vos questions</p>
            </div>

            {/* Body avec historique des messages */}
            <div className="p-4 bg-muted/30 flex-1 overflow-y-auto">
              <BotMessage
                message="👋 Bonjour ! Laissez-nous un message et nous vous répondrons rapidement par email."
                botName="Scrapdeouf"
              />
              
              {/* Messages de la conversation */}
              {conversation.map((msg, index) => (
                msg.type === 'bot' ? (
                  <BotMessage
                    key={index}
                    message={msg.text}
                    botName="Scrapdeouf"
                  />
                ) : (
                  <div key={index} className="flex items-start gap-3 mb-4 justify-end">
                    <div className="flex flex-col gap-1 items-end">
                      <span className="font-semibold text-sm text-foreground">Vous</span>
                      <div className="bg-gray-200 rounded-xl p-3 border border-border max-w-[280px]">
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-500 text-white">
                        VO
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )
              ))}
              
              {isLoading && (
                <BotMessage
                  message="Envoi en cours..."
                  botName="Scrapdeouf"
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border flex items-end gap-2 shrink-0">
              <Textarea
                placeholder="Tapez votre message ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[40px] max-h-[120px] resize-y bg-background flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:outline-none"
                disabled={isLoading}
              />
              {message.trim() && (
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shrink-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}