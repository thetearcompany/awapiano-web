import { Card } from "@/components/ui/card"
import Link from "next/link"

interface TrendingTopicsListProps {
  topics: string[]
}

export function TrendingTopicsList({ topics }: TrendingTopicsListProps) {
  return (
    <Card className="glass-card p-6">
      <h3 className="font-bold mb-4">Trending Topics</h3>
      <div className="space-y-3">
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading topics...</p>
        ) : (
          topics.map((topic, index) => (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="block text-secondary hover:underline"
            >
              {topic}
            </Link>
          ))
        )}
      </div>
    </Card>
  )
}

