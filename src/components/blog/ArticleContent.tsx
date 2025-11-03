// components/blog/ArticleContent.tsx

import { Card, CardContent } from '@/components/ui/card'

// Types plus précis pour chaque type de section
export interface ArticleIntro {
  type: "intro"
  content: string
}

export interface ArticleTip {
  type: "tip"
  content: string
}

export interface ArticleParagraph {
  type: "paragraph"
  content: string
}

export interface ArticleSection {
  type: "section"
  emoji: string
  title: string
  content: string
  example?: string
  list?: string[]
  code?: string
}

export interface ArticleTable {
  type: "table"
  title: string
  headers: string[]
  rows: string[][]
}

export interface ArticleConclusion {
  type: "conclusion"
  title: string
  content: string[]
}

// Union type pour toutes les sections possibles
export type ArticleSectionType = 
  | ArticleIntro 
  | ArticleTip 
  | ArticleParagraph 
  | ArticleSection 
  | ArticleTable 
  | ArticleConclusion

interface ArticleContentProps {
  content: ArticleSectionType[]
}

export function ArticleContent({ content }: ArticleContentProps) {
  const renderContent = () => {
    return content.map((item, index) => {
      switch (item.type) {
        case "intro":
          return (
            <p key={index} className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 italic border-l-4 border-blue-500 pl-6">
              {item.content}
            </p>
          )
        
        case "tip":
          return (
            <Card key={index} className="my-8 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="pt-6">
                <p className="text-base text-slate-700 dark:text-slate-300">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          )
        
        case "paragraph":
          return (
            <p key={index} className="text-lg leading-relaxed mb-6 text-slate-700 dark:text-slate-300">
              {item.content}
            </p>
          )
        
        case "section":
          return (
            <section key={index} className="mb-12 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <span className="text-2xl">{item.emoji}</span>
                {item.title}
              </h2>
              <p className="text-base leading-relaxed mb-4 text-slate-700 dark:text-slate-300">
                {item.content}
              </p>
              
              {item.list && (
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-slate-700 dark:text-slate-300">
                  {item.list.map((listItem, listIndex) => (
                    <li key={listIndex}>{listItem}</li>
                  ))}
                </ul>
              )}

              {item.code && (
                <div className="my-4 p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{item.code}</pre>
                </div>
              )}
              
              {item.example && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">💡</span>
                      </div>
                      <div>
                        <strong className="text-blue-700 dark:text-blue-300">Exemple concret :</strong>
                        <p className="mt-1 text-slate-700 dark:text-slate-300">{item.example}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>
          )

        case "table":
          return (
            <div key={index} className="my-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">{item.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      {item.headers.map((header, headerIndex) => (
                        <th key={headerIndex} className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-600">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-700'}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        
        case "conclusion":
          return (
            <Card key={index} className="my-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                {item.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-base leading-relaxed opacity-95 mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          )
        
        default:
          // TypeScript va vérifier que tous les cas sont couverts
          const _exhaustiveCheck: never = item
          return null
      }
    })
  }

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-slate-400">
      {renderContent()}
    </div>
  )
}