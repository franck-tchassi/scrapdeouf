"use client";

import { useState } from 'react'
import { useI18n } from '@/locales/client';

export default function FAQSection() {
  const t = useI18n();
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const faqs = [
    {
      question: `${t("landing.faq.items.0.question")}`,
      answer: `${t("landing.faq.items.0.answer")}`
    },
    {
      question: `${t("landing.faq.items.1.question")}`,
      answer: `${t("landing.faq.items.1.answer")}`
    },
    {
      question: `${t("landing.faq.items.2.question")}`,
      answer: `${t("landing.faq.items.2.answer")}`
    },
    {
      question: `${t("landing.faq.items.3.question")}`,
      answer: `${t("landing.faq.items.3.answer")}`
    },
    {
      question: `${t("landing.faq.items.4.question")}`,
      answer: `${t("landing.faq.items.4.answer")}`
    },
    {
      question: `${t("landing.faq.items.5.question")}`,
      answer: `${t("landing.faq.items.5.answer")}`,
    },
    {
      question: `${t("landing.faq.items.6.question")}`,
      answer: `${t("landing.faq.items.6.answer")}`,
    },
    {
      question: `${t("landing.faq.items.7.question")}`,
      answer: `${t("landing.faq.items.7.answer")}`,
    },
    {
      question: `${t("landing.faq.items.8.question")}`,
      answer: `${t("landing.faq.items.8.answer")}`,
    },
    {
      question: `${t("landing.faq.items.9.question")}`,
      answer: `${t("landing.faq.items.9.answer")}`,
    },
    {
      question: `${t("landing.faq.items.10.question")}`,
      answer: `${t("landing.faq.items.10.answer")}`,
    },
    {
      question: `${t("landing.faq.items.11.question")}`,
      answer: `${t("landing.faq.items.11.answer")}`,
    },
    {
      question: `${t("landing.faq.items.12.question")}`,
      answer: `${t("landing.faq.items.12.answer")}`,
    },
    
   
  ]

  return (
    <div className="relative isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-1155/678 w-288.75 bg-gradient-to-tr to-[#9089fc] from-[#4F46E5] opacity-20"
        />
      </div>
      
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base/7 font-semibold text-indigo-400">FAQ</h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
          {t("landing.faq.title")}
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="rounded-2xl bg-gray-800 p-6 ring-1 ring-white/10"
            >
              <button
                className={`flex items-center justify-between w-full text-left ${
                  activeIndex === index ? 'cursor-pointer' : 'hover:text-gray-300 cursor-pointer'
                } transition-colors`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-white">
                  {faq.question}
                </span>
                <span className="text-[#5c36f7] ml-4 flex-shrink-0">
                  {activeIndex === index ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  activeIndex === index
                    ? 'max-h-40 opacity-100 mt-4'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="h-px bg-gray-700 my-3"></div>
                <p className="text-gray-300 text-base/7">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}