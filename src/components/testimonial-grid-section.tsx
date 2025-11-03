import Image from "next/image"
import HighlightText from "./layout/HighlightText"

type TestimonialType = "large-teal" | "large-light" | "small-dark"

interface Testimonial {
    quote: string
    name: string
    company: string
    avatar: string
    type: TestimonialType
}

const testimonials: Testimonial[] = [
    {
        quote:
            "Les données extraites de Google Maps ont transformé notre prospection commerciale. Nous avons multiplié par 3 notre taux de conversion grâce aux coordonnées précises et aux avis clients analysés.",
        name: "Marie Dubois",
        company: "Agence Immobilière Premium",
        avatar: "/fille1.jpg",
        type: "large-teal",
    },
    {
        quote:
            "Le scraping Amazon nous permet de surveiller nos concurrents en temps réel. Nous ajustons nos prix et notre stratégie marketing quotidiennement.",
        name: "Thomas Martin",
        company: "E-commerce Tech",
        avatar: "/garcon1.jpg",
        type: "small-dark",
    },
    {
        quote:
            "Grâce aux données Leboncoin, nous identifions les tendances du marché de l'occasion avant tout le monde. Un avantage concurrentiel énorme !",
        name: "Sophie Lambert",
        company: "Revendeur Pro",
        avatar: "/fille2.jpg",
        type: "small-dark",
    },
    {
        quote:
            "L'export en CSV est parfait pour notre analyse. Nous intégrons directement les données dans notre CRM sans traitement supplémentaire.",
        name: "Alexandre Petit",
        company: "Consultant Digital",
        avatar: "/garcon2.jpg",
        type: "small-dark",
    },
    {
        quote:
            "Nous avons testé plusieurs solutions de scraping, mais celle-ci se distingue par sa fiabilité et la qualité du support technique.",
        name: "Laura Moreau",
        company: "Startup FoodTech",
        avatar: "/fille3.jpg",
        type: "small-dark",
    },
    {
        quote:
            "Le scraping Google Maps nous a permis d'identifier 200+ prospects qualifiés dans notre secteur en moins d'une semaine. La qualité des données est exceptionnelle.",
        name: "Nicolas Rousseau",
        company: "Analyste Data",
        avatar: "/garcon3.jpg",
        type: "small-dark",
    },
    {
        quote:
            "En tant qu'agence marketing, nous utilisons ces données pour nos clients. Les rapports d'analyse de concurrence sont particulièrement appréciés. L'extraction Google Maps nous fait gagner un temps considérable.",
        name: "David Leroy",
        company: "Agence Marketing Local",
        avatar: "/garcon4.jpg",
        type: "large-light",
    },
]

interface TestimonialCardProps extends Testimonial { }

const TestimonialCard = ({ quote, name, company, avatar, type }: TestimonialCardProps) => {
    const isLargeCard = type.startsWith("large")
    const avatarSize = isLargeCard ? 48 : 36
    const avatarBorderRadius = isLargeCard ? "rounded-[41px]" : "rounded-[30.75px]"
    const padding = isLargeCard ? "p-6" : "p-[30px]"

    let cardClasses = `flex flex-col justify-between items-start overflow-hidden rounded-[10px] shadow-[0px_2px_4px_rgba(0,0,0,0.08)] relative ${padding}`
    let quoteClasses = ""
    let nameClasses = ""
    let companyClasses = ""
    let backgroundElements = null
    let cardHeight = ""
    const cardWidth = "w-full md:w-[384px]"

    if (type === "large-teal") {
        cardClasses += " bg-white border border-indigo-200 border-purple-200"
        quoteClasses += " text-gray-900 text-2xl font-medium leading-8"
        nameClasses += " text-gray-900   text-base font-normal leading-6"
        companyClasses += " text-gray-600  text-base font-normal leading-6"
        cardHeight = "h-[502px]"
        backgroundElements = (
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-10"
                style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
            />
        )
    } else if (type === "large-light") {
        cardClasses += " bg-white border   border-indigo-200 border-purple-200"
        quoteClasses += " text-gray-900 text-2xl font-medium leading-8"
        nameClasses += " text-gray-900 text-base font-normal leading-6"
        companyClasses += " text-gray-600 text-base font-normal leading-6"
        cardHeight = "h-[502px]"
        backgroundElements = (
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-5"
                style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
            />
        )
    } else {
        cardClasses += " bg-white border border-indigo-200 border-purple-200"
        quoteClasses += " text-gray-700 text-[17px] font-normal leading-6"
        nameClasses += " text-gray-900 text-sm font-normal leading-[22px]"
        companyClasses += " text-gray-500 text-sm font-normal leading-[22px]"
        cardHeight = "h-[244px]"
    }

    return (
        <div className={`${cardClasses} ${cardWidth} ${cardHeight}`}>
            {backgroundElements}
            <div className={`relative z-10 font-normal break-words ${quoteClasses}`}>{quote}</div>
            <div className="relative z-10 flex justify-start items-center gap-3">
                <Image
                    src={avatar || "/placeholder.svg"}
                    alt={`${name} avatar`}
                    width={avatarSize}
                    height={avatarSize}
                    className={`w-${avatarSize / 4} h-${avatarSize / 4} ${avatarBorderRadius}`}
                    style={{ border: "1px solid rgba(255, 255, 255, 0.08)" }}
                />
                <div className="flex flex-col justify-start items-start gap-0.5">
                    <div className={nameClasses}>{name}</div>
                    <div className={companyClasses}>{company}</div>
                </div>
            </div>
        </div>
    )
}

export function TestimonialGridSection() {
    return (
        <section className="w-full px-5 overflow-hidden flex flex-col justify-start py-6 md:py-8 lg:py-14 ">
            <div className="self-stretch py-6 md:py-8 lg:py-14 flex flex-col justify-center items-center gap-2">
                <div className="flex flex-col justify-start items-center gap-4">
                    <h2 className="text-center text-gray-900 text-3xl md:text-4xl lg:text-[40px] font-semibold leading-tight md:leading-tight lg:leading-[40px]">
                        Ce que nos <HighlightText variant="fancy-slant" color="secondary">clients disent</HighlightText>
                    </h2>
                    
                </div>
            </div>
            <div className="w-full pt-0.5 pb-4 md:pb-6 lg:pb-10 flex flex-col md:flex-row justify-center items-start gap-4 md:gap-4 lg:gap-6 max-w-[1100px] mx-auto">
                <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
                    <TestimonialCard {...testimonials[0]} />
                    <TestimonialCard {...testimonials[1]} />
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
                    <TestimonialCard {...testimonials[2]} />
                    <TestimonialCard {...testimonials[3]} />
                    <TestimonialCard {...testimonials[4]} />
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
                    <TestimonialCard {...testimonials[5]} />
                    <TestimonialCard {...testimonials[6]} />
                </div>
            </div>
            
            
        </section>
    )
}