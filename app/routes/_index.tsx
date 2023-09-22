import ArticleCard from "~/components/articleCard"

export default function Home() {
  const articles = [
    {
      id: 1,
      name: 'Test',
      description: 'My toy',
      price: 12.3,
      img: []
    }
  ]
  return <div>
    Store
    {
      articles.map(article => <ArticleCard key={article.id} article={article} />)
    }
  </div>
}