import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PopularGroupsListProps {
  groups: any[]
}

export function PopularGroupsList({ groups }: PopularGroupsListProps) {
  return (
    <Card className="glass-card p-6">
      <h3 className="font-bold mb-4">Popular Groups</h3>
      <div className="space-y-4">
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading groups...</p>
        ) : (
          groups.map((group, index) => (
            <div key={group.id || index} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold">
                {group.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{group.name}</p>
                <p className="text-xs text-muted-foreground">{group.membersCount.toLocaleString()} members</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 rounded-full">
                Join
              </Button>
            </div>
          ))
        )}
      </div>
      <Button variant="link" className="w-full text-secondary mt-2">
        View All Groups
      </Button>
    </Card>
  )
}

