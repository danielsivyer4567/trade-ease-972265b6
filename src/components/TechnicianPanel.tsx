import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, Clock, CheckCircle, AlertCircle, Calendar, Settings } from "lucide-react"
import type { Technician, Job } from "../types/job"

interface TechnicianPanelProps {
  technicians: Technician[]
  jobs: Job[]
}

export function TechnicianPanel({ technicians, jobs }: TechnicianPanelProps) {
  const getTechnicianJobs = (techId: string) => {
    return jobs.filter((job) => job.assignedTo === techId)
  }

  const getTechnicianWorkload = (techId: string) => {
    const techJobs = getTechnicianJobs(techId)
    return {
      active: techJobs.filter((j) => j.status === "in-progress").length,
      pending: techJobs.filter((j) => j.status === "ready").length,
      completed: techJobs.filter((j) => j.status === "completed").length,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Team Overview</h2>
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Manage Team
        </Button>
      </div>

      <div className="grid gap-4">
        {technicians.map((tech) => {
          const workload = getTechnicianWorkload(tech.id)
          const utilizationRate = ((workload.active / tech.maxConcurrentJobs) * 100).toFixed(0)

          return (
            <Card key={tech.id} className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {tech.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{tech.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {tech.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={tech.isAvailable ? "default" : "secondary"}
                      className={tech.isAvailable ? "bg-green-100 text-green-800" : ""}
                    >
                      {tech.isAvailable ? "Available" : "Busy"}
                    </Badge>
                    <Badge variant="outline">{utilizationRate}% utilized</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{tech.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>
                      {tech.shift.start} - {tech.shift.end}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {tech.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{workload.completed} completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span>{workload.active} active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{workload.pending} pending</span>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-green-600">${tech.hourlyRate}/hr</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 