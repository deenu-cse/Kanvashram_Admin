"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Power, IndianRupee } from "lucide-react"

export function DonationCard({ donation, onEdit, onDelete, onToggleStatus }) {
  const IconComponent = getIconComponent(donation.icon)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${donation.color || "from-amber-500 to-orange-600"}`}>
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-serif">{donation.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{donation.englishTitle}</p>
            </div>
          </div>
          <Badge variant={donation.isActive ? "default" : "secondary"}>
            {donation.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {donation.description}
        </p>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Suggested Amounts:</p>
          <div className="flex flex-wrap gap-1">
            {donation.suggested.map((amount, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                <IndianRupee className="h-3 w-3" />
                {amount.toLocaleString()}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(donation._id)}
          className="flex-1 gap-2"
        >
          <Power className="h-4 w-4" />
          {donation.isActive ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(donation)}
          className="flex-1 gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(donation._id)}
          className="text-destructive hover:text-destructive gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper function to get icon component
function getIconComponent(iconName) {
  const iconMap = {
    'home': require("lucide-react").Home,
    'flame': require("lucide-react").Flame,
    'book-open': require("lucide-react").BookOpen,
    'heart': require("lucide-react").Heart,
    'leaf': require("lucide-react").Leaf,
    'users': require("lucide-react").Users,
  }
  
  return iconMap[iconName] || require("lucide-react").Heart
}