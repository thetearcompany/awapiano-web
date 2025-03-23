import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRelativeTime } from "@/lib/utils"

interface Activity {
  id: string
  name: string
  data?: string
  userId?: string
  createdAt: Date | string
  user?: {
    id: string
    name: string | null
    image: string | null
  } | null
}

interface AdminRecentActivityProps {
  activities: Activity[]
}

export function AdminRecentActivity({ activities }: AdminRecentActivityProps) {
  // Parse activity data
  const parseActivity = (activity: Activity) => {
    try {
      const data = activity.data ? JSON.parse(activity.data) : {}

      // Format activity based on name
      switch (activity.name) {
        case "user.login":
          return {
            action: "logged in",
            target: "",
          }
        case "user.register":
          return {
            action: "registered an account",
            target: "",
          }
        case "content.create":
          return {
            action: `created ${data.type || "content"}`,
            target: data.title || "",
          }
        case "content.update":
          return {
            action: `updated ${data.type || "content"}`,
            target: data.title || "",
          }
        case "content.delete":
          return {
            action: `deleted ${data.type || "content"}`,
            target: data.title || "",
          }
        case "track.upload":
          return {
            action: "uploaded a track",
            target: data.title || "",
          }
        case "track.play":
          return {
            action: "played a track",
            target: data.title || "",
          }
        case "order.create":
          return {
            action: "placed an order",
            target: `#${data.orderId || ""}`,
          }
        default:
          return {
            action: activity.name.replace(".", " "),
            target: "",
          }
      }
    } catch (error) {
      return {
        action: activity.name || "performed an action",
        target: "",
      }
    }
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
      ) : (
        activities.map((activity) => {
          const { action, target } = parseActivity(activity)
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0"
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={activity.user?.image || "/placeholder.svg?height=32&width=32"}
                  alt={activity.user?.name || "User"}
                />
                <AvatarFallback className="bg-primary text-xs">{activity.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user?.name || "Anonymous User"}</span>{" "}
                  <span className="text-muted-foreground">{action}</span>
                  {target && <span className="font-medium"> {target}</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(activity.createdAt.toString())}
                </p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

