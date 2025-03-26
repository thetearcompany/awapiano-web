import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminMetricCardProps {
  title: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: LucideIcon
  description?: string
  className?: string
}

export function AdminMetricCard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  description,
  className,
}: AdminMetricCardProps) {
  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          {Icon && (
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>

        {(change || description) && (
          <div className="mt-4 flex items-center justify-between">
            {change && (
              <div
                className={cn(
                  "flex items-center text-xs font-medium",
                  trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground",
                )}
              >
                {trend === "up" ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : trend === "down" ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : null}
                {change}
              </div>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

