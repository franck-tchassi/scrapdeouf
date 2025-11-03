// lib/blog-content/index.ts
import { top10CasUsageContent } from './top-10-cas-usage-scraping-marketing'
import { strategiesBlocageContent } from './strategies-eviter-blocage-scraping'
import { ArticleSectionType } from '@/components/blog/ArticleContent'

export const ARTICLE_CONTENT: Record<string, ArticleSectionType[]> = {
  "top-10-cas-usage-scraping-marketing": top10CasUsageContent,
  "strategies-eviter-blocage-scraping": strategiesBlocageContent
}

export type ArticleSlug = keyof typeof ARTICLE_CONTENT