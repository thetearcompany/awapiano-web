import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UserProfileCardProps {
  profile: any | null
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  if (!profile) {
    return (
      <Card className="glass-card p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-2 border-primary mb-4">
            <AvatarFallback className="bg-primary text-lg">?</AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-lg">Welcome, Guest</h3>
          <p className="text-sm text-muted-foreground mb-4">Sign in to join the community</p>
          <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
            Sign In
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 border-2 border-primary mb-4">
          <AvatarImage src={profile.image || "/placeholder.svg?height=80&width=80"} alt={profile.name} />
          <AvatarFallback className="bg-primary text-lg">{profile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-bold text-lg">{profile.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">@{profile.email.split("@")[0]}</p>
        <div className="flex justify-center gap-4 w-full mb-4">
          <div className="text-center">
            <p className="font-bold">{profile.postsCount || 0}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{profile.followersCount || 0}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{profile.followingCount || 0}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
        <Link href="/profile" passHref>
          <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  )
}

