import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppChat from "@/components/WhatsAppChat";
import Script from "next/script"; // Garder pour d'autres scripts comme le JSON-LD


const inter = Inter({
  subsets: ['latin'],
  variable: "--font-inter",
  preload: false,
});

// ✅ SEO principal (généré automatiquement par Next)
export const metadata: Metadata = {
  title: "Scrapdeouf | Scraping web facile - Produits, avis, Google Maps",
  description:
    "Scrapdeouf est un outil SaaS de scraping web puissant et simple : extrayez facilement des produits, avis clients et données Google Maps.",
  keywords: ["scraping", "SaaS", "produits", "avis", "Google Maps", "data"],
  authors: [{ name: "Scrapdeouf", url: "https://scrapdeouf.com" }],
  metadataBase: new URL("https://scrapdeouf.com"),
  alternates: {
    canonical: "https://scrapdeouf.com",
    languages: {
      "fr": "/fr",
      "en": "/en",
      "es": "/es",
      "de": "/de",
      "pt": "/pt",
    },
  },
  openGraph: {
    title: "Scrapdeouf - Scraping de données web intelligent",
    description:
      "Scrapez produits, avis, Google Maps et plus avec Scrapdeouf, le meilleur SaaS de scraping sans code.",
    url: "https://scrapdeouf.com",
    siteName: "Scrapdeouf",
    images: [
      {
        url: "https://scrapdeouf.com/s-logo.png", // 💡 Mets ici ton image OG
        width: 1200,
        height: 630,
        alt: "Scrapdeouf - Scraping sans prise de tête",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scrapdeouf - Scraping web facile",
    description:
      "Scrapez des produits, avis clients et cartes avec notre outil SaaS.",
    images: ["https://scrapdeouf.com/s-logo.png"],
    creator: "@scrapdeouf",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="fr">
      <head>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Scrapdeouf",
              operatingSystem: "Web-based",
              applicationCategory: "BusinessApplication",
              description:
                "Scrapdeouf est un outil SaaS de scraping web sans code. Scrapez des produits, avis clients, Google Maps et plus en quelques clics.",
              url: "https://scrapdeouf.com",
              logo: "https://scrapdeouf.com/s-logo.png",
              image: "https://scrapdeouf.com/s-logo.png",
              creator: {
                "@type": "Organization",
                name: "Scrapdeouf",
                url: "https://scrapdeouf.com",
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "EUR",
                price: "25",
                availability: "https://schema.org/InStock",
                url: "https://scrapdeouf.com/tarifs",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "132",
              },
            }),
          }}
        />
        
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased`}
      >
        {children}
        <WhatsAppChat />
        
      </body>
    </html>
  );
};

export default RootLayout;