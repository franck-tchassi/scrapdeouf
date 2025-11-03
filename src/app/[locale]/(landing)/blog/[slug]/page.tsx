// app/blog/[slug]/page.tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getRelatedArticles } from '@/lib/blog-data'
import { ARTICLE_CONTENT } from '@/lib/blog-content'
import { ArticleContent } from '@/components/blog/ArticleContent'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, User, Eye } from 'lucide-react'

interface BlogArticlePageProps {
  params: {
    slug: string
  }
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const article = getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }

  const articleContent = ARTICLE_CONTENT[slug as keyof typeof ARTICLE_CONTENT] || []
  const relatedArticles = getRelatedArticles(slug)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/20">
      {/* Navigation */}
      <div className="pt-32 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour au blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête de l'article */}
          <header className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                {article.category}
              </span>
              
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900 dark:text-slate-100">
              {article.title}
            </h1>
            
            {/* Auteur et métadonnées */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{article.author.name}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {article.readTime} de lecture
                    </span>
                    
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Image principale */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </header>

          {/* Contenu principal */}
          <div className="max-w-3xl mx-auto">
            <ArticleContent content={articleContent} />

            {/* Auteur détaillé */}
            <Card className="mt-12 bg-white dark:bg-slate-800 border-0 shadow-sm rounded-2xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{article.author.name}</h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Expert en scraping web et marketing data-driven avec plus de 8 ans d'expérience. 
                      Passionné par l'innovation et l'automatisation des processus marketing pour aider les entreprises à prendre des décisions éclairées.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="rounded-full">
                        Voir tous les articles
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-full">
                        Suivre
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Articles similaires */}
          {relatedArticles.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📚 Articles similaires</h3>
                <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Voir tout
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map(relatedArticle => (
                  <Card key={relatedArticle.id} className="group overflow-hidden border-0 bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                    <div className="relative overflow-hidden h-40">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Link href={`/blog/${relatedArticle.slug}`}>
                          {relatedArticle.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

         
        </div>
      </article>
    </div>
  )
}