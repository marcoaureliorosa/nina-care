// Certifique-se de instalar o framer-motion: npm install framer-motion
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface MetricCardProps {
  title: string
  value: string | number
  percentage?: number
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  description?: string
}

const trendColors = {
  up: "bg-emerald-100 text-emerald-700 border-emerald-200",
  down: "bg-red-100 text-red-700 border-red-200",
  neutral: "bg-gray-100 text-gray-700 border-gray-200"
}

const trendIcons = {
  up: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
  ),
  down: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
  ),
  neutral: null
}

const MetricCard = ({ 
  title, 
  value, 
  percentage, 
  icon: Icon, 
  trend = "neutral",
  description 
}: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="transition-all hover:shadow-xl border-0 bg-white/90 dark:bg-zinc-900/90 rounded-2xl p-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-ninacare-primary/10 p-3 flex items-center justify-center">
            <Icon className="h-8 w-8 text-ninacare-primary" />
          </div>
          <CardTitle className="text-base font-semibold text-zinc-700 dark:text-zinc-100">
            {title}
          </CardTitle>
        </div>
        {percentage !== undefined && trend !== "neutral" && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${trendColors[trend]}`}>
            {trendIcons[trend]}
            {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
          </span>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

export default MetricCard
