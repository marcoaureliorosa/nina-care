
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  percentage?: number
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  description?: string
}

const MetricCard = ({ 
  title, 
  value, 
  percentage, 
  icon: Icon, 
  trend = "up",
  description 
}: MetricCardProps) => (
  <Card className="transition-all hover:shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-ninacare-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {percentage !== undefined && (
        <div className="flex items-center space-x-2 mt-2">
          <Progress 
            value={percentage} 
            className="flex-1 h-2" 
          />
          <span className="text-sm font-medium text-ninacare-primary">
            {percentage}%
          </span>
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
)

export default MetricCard
