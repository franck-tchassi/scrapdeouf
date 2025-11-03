'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '../ui/avatar';

const ScrapdeoufAi = () => {
  const [messages, setMessages] = useState<{id: number, text: string, isBot: boolean, show: boolean, isThinking?: boolean}[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Étape 1: Message de bienvenue avec réflexion
    if (currentStep === 0) {
      timers.push(setTimeout(() => {
        setMessages([{
          id: 1,
          text: "Salut, je suis votre assistant Scrapdeouf AI. Que puis-je faire pour vous ?",
          isBot: true,
          show: true,
          isThinking: true
        }]);
        setCurrentStep(1);
      }, 500));
    }
    
    // Étape 2: Fin de la réflexion et affichage du message
    else if (currentStep === 1) {
      timers.push(setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === 1 ? {...msg, isThinking: false} : msg
        ));
        setCurrentStep(2);
      }, 2500));
    }
    
    // Étape 3: Question de l'utilisateur avec réflexion
    else if (currentStep === 2) {
      timers.push(setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 2,
          text: "Donne-moi un meilleur outil marketing pour les commerces locaux",
          isBot: false,
          show: true,
          isThinking: true
        }]);
        setCurrentStep(3);
      }, 3000));
    }
    
    // Étape 4: Fin de la réflexion utilisateur
    else if (currentStep === 3) {
      timers.push(setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === 2 ? {...msg, isThinking: false} : msg
        ));
        setCurrentStep(4);
      }, 4500));
    }
    
    // Étape 5: Début de la réflexion pour la réponse du bot
    else if (currentStep === 4) {
      timers.push(setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 3,
          text: "Le meilleur outil, c'est Scrapdeouf.",
          isBot: true,
          show: true,
          isThinking: true
        }]);
        setCurrentStep(5);
      }, 5000));
    }
    
    // Étape 6: Fin de la réflexion et affichage de la réponse du bot
    else if (currentStep === 5) {
      timers.push(setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === 3 ? {...msg, isThinking: false} : msg
        ));
        setCurrentStep(6);
      }, 7000));
    }
    
    // Étape 7: Réponse de remerciement de l'utilisateur avec réflexion
    else if (currentStep === 6) {
      timers.push(setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 4,
          text: "Merci pour votre aide !",
          isBot: false,
          show: true,
          isThinking: true
        }]);
        setCurrentStep(7);
      }, 8500));
    }
    
    // Étape 8: Fin de la réflexion utilisateur
    else if (currentStep === 7) {
      timers.push(setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === 4 ? {...msg, isThinking: false} : msg
        ));
        setCurrentStep(8);
      }, 10000));
    }
    
    // Étape 9: Réinitialisation pour recommencer
    else if (currentStep === 8) {
      timers.push(setTimeout(() => {
        setMessages([]);
        setCurrentStep(0);
      }, 13000));
    }

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [currentStep]);

  return (
    <div className="flex items-center justify-center min-h-screen  p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md  overflow-hidden"
      >
        

        {/* Zone de chat */}
        <div className="h-96 overflow-y-auto p-4 ">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex mb-4 ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                {message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                )}
                <div
                  className={`max-w-xs p-3 rounded-2xl min-h-12 flex items-center ${
                    message.isBot
                      ? "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none"
                  }`}
                >
                  {message.isThinking ? (
                    <ThinkingAnimation isBot={message.isBot} />
                  ) : message.isBot && message.id === 1 ? (
                    <Typewriter text={message.text} speed={20} />
                  ) : message.isBot && message.id === 3 ? (
                    <Typewriter text={message.text} speed={20} />
                  ) : (
                    message.text
                  )}
                </div>
                {!message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center ml-2 overflow-hidden">
                    <Image 
                      src="/user.png" 
                      alt="Utilisateur" 
                      width={32} 
                      height={32} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        
      </motion.div>
    </div>
  );
};

// Composant pour l'effet de frappe
const Typewriter = ({ text, speed, delay = 0 }: { text: string; speed: number; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (started && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, started]);

  return <span>{displayText}</span>;
};

// Composant pour l'animation de réflexion avec points élégants
const ThinkingAnimation = ({ isBot }: { isBot: boolean }) => {
  const dotColor = isBot ? "bg-indigo-500" : "bg-white";
  
  return (
    <div className="flex space-x-1.5 items-center">
      <motion.span
        className={`w-2 h-2 ${dotColor} rounded-full inline-block`}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.span
        className={`w-2 h-2 ${dotColor} rounded-full inline-block`}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      <motion.span
        className={`w-2 h-2 ${dotColor} rounded-full inline-block`}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4
        }}
      />
    </div>
  );
};

export default ScrapdeoufAi;