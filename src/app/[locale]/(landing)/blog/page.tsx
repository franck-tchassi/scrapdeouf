// app/blog/page.tsx

// app/blog/page.tsx
import Link from 'next/link'
import { blogArticles } from '@/lib/blog-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight, Search, Filter, User } from 'lucide-react'

export default function BlogPage() {
  const categories = Array.from(new Set(blogArticles.map(article => article.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/20">
      {/* Hero Section avec padding pour le header fixed */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-blue-700 dark:from-slate-100 dark:to-blue-300 bg-clip-text text-transparent">
              Blog Scrapdeouf
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos guides experts sur le scraping web, le marketing data-driven 
              et les stratégies digitales innovantes. Devenez maître de la data.
            </p>
        
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Articles en grille */}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
            {blogArticles.map((article) => (
              <Card key={article.id} className="group relative overflow-hidden border-0 bg-white dark:bg-slate-800  transition-all duration-500 rounded-3xl h-full flex flex-col">
                {/* Badge de catégorie */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    {article.category}
                  </span>
                </div>
                
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Contenu */}
                <CardHeader className="flex-1 p-6">
                  {/* Métadonnées */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  {/* Titre */}
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-tight">
                    <Link href={`/blog/${article.slug}`} className="hover:no-underline">
                      {article.title}
                    </Link>
                  </CardTitle>
                  
                  {/* Description */}
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 text-base">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                
                {/* Footer avec auteur et CTA */}
                <CardContent className="p-6 pt-0 mt-auto">
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {article.author.name}
                      </span>
                    </div>
                    
                    <Button asChild variant="ghost" size="sm" className="group/btn text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Link href={`/blog/${article.slug}`} className="flex items-center gap-2">
                        Lire
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
                
                {/* Effet de hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 rounded-3xl transition-all duration-300 pointer-events-none" />
              </Card>
            ))}
          </div>

          
        </div>
      </section>

      
    </div>
  )
}