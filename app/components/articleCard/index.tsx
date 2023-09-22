import styles from './styles.module.css';

export default function ArticleCard({ article }: any) {
  return <a href={`/article/${article.id}`}>
    <div className={styles.container}>
      {article.name}
    </div>
  </a>
}