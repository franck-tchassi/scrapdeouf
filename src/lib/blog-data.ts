// lib/blog-data.ts

export interface BlogArticle {
    id: number
    slug: string
    title: string
    excerpt: string
    date: string
    readTime: string
    category: string
    image: string
    author: {
      name: string
      avatar: string
    }
    tags: string[]
  }
  
  export const blogArticles: BlogArticle[] = [
    {
      id: 1,
      slug: "top-10-cas-usage-scraping-marketing",
      title: "Top 10 des cas d'usage du scraping dans le marketing moderne",
      excerpt: "Dans un monde où la donnée est devenue le nouveau pétrole, le scraping web s'impose comme un levier incontournable pour les marketeurs.",
      date: "2025-10-22",
      readTime: "8 min",
      category: "Marketing Digital",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      author: {
        name: "Jean Dupont",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
      },
      tags: ["scraping", "marketing", "data", "automatisation"]
    },
    {
      id: 2,
      slug: "strategies-eviter-blocage-scraping",
      title: "Les meilleures stratégies pour éviter d'être bloqué pendant un scraping",
      excerpt: "Découvrez comment scraper efficacement sans jamais être bloqué, même sur les plateformes les plus protégées.",
      date: "2025-10-23",
      readTime: "10 min",
      category: "Technique",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      author: {
        name: "Marie Martin", 
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80"
      },
      tags: ["technique", "anti-blocage", "proxies", "best-practices"]
    }
]
  
export function getArticleBySlug(slug: string): BlogArticle | undefined {
    return blogArticles.find(article => article.slug === slug)
}
  
export function getRelatedArticles(currentSlug: string, limit: number = 3): BlogArticle[] {
    return blogArticles
      .filter(article => article.slug !== currentSlug)
      .slice(0, limit)
}