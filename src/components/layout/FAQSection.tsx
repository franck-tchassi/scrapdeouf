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
    <div className="relative bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-12 sm:mb-16">
          <h2 className="text-sm sm:text-base font-semibold text-indigo-600 uppercase tracking-wide">FAQ</h2>
          <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance text-gray-900">
            {t("landing.faq.title")}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl sm:rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <button
                  className={`flex items-start justify-between w-full text-left p-4 sm:p-5 lg:p-6 ${activeIndex === index
                    ? 'bg-gray-50'
                    : 'hover:bg-gray-50'
                    } transition-colors duration-200`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-900 pr-4 flex-1 text-left">
                    {faq.question}
                  </span>
                  <span className="text-indigo-600 ml-4 flex-shrink-0 mt-0.5">
                    {activeIndex === index ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="h-px bg-gray-200 mx-4 sm:mx-5 lg:mx-6"></div>
                  <div className="p-4 sm:p-5 lg:p-6 pt-4 sm:pt-5 lg:pt-6">
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}