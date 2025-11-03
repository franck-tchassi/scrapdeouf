// components/blog/BlogCard.tsx
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { BlogArticle } from '@/lib/blog-data'

interface BlogCardProps {
  article: BlogArticle
}

export default function BlogCard({ article }: BlogCardProps) {
  return (
    <Card className="group overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
            {article.category}
          </span>
        </div>
      </div>
      
      <CardHeader className="flex-1">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(article.date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {article.readTime}
          </span>
        </div>
        
        <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </CardTitle>
        
        <CardDescription className="text-base leading-relaxed line-clamp-3">
          {article.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-muted-foreground">
              {article.author.name}
            </span>
          </div>
          
          <Button asChild variant="ghost" size="sm" className="group/btn">
            <Link href={`/blog/${article.slug}`}>
              Lire
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}