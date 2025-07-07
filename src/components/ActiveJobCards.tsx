"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  User,
  Hash,
  GripVertical,
  Zap,
  Wrench,
  Settings,
  AlertTriangle,
  Scale,
  DollarSign,
  MapPin,
  MessageSquare,
  Phone,
  Calendar,
  PenToolIcon as Tool,
  CheckCircle2,
  PlayCircle,
  Plus,
} from "lucide-react"
import { useState } from "react"

// Types for the component
interface Job {
  id: string
  type: string
  customer: string
  status: "pending" | "ready" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  category: "emergency" | "maintenance" | "electrical" | "hvac" | "plumbing"
  size: "S" | "M" | "L" | "XL"
  assignedTo?: string
  estimatedDuration: number
  value: number
  cost: number
  location: {
    address: string
    lat: number
    lng: number
  }
  createdAt: Date
  dueDate: Date
  completedAt?: Date
  customerRating?: number
  notes: string[]
  tags: string[]
  weatherSensitive: boolean
  requiresSpecialEquipment: boolean
}

interface Technician {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  certifications: string[]
  currentJobs: string[]
  maxConcurrentJobs: number
  hourlyRate: number
  isAvailable: boolean
}

interface ActiveJobCardsProps {
  jobs: Job[]
  technicians: Technician[]
  selectedJobs: string[]
  onJobSelect: (jobId: string) => void
  onStatusUpdate: (jobId: string, status: Job["status"]) => void
  onAssign: (jobId: string, technicianId: string) => void
}

export function ActiveJobCards({
  jobs,
  technicians,
  selectedJobs,
  onJobSelect,
  onStatusUpdate,
  onAssign,
}: ActiveJobCardsProps) {
  const [expandedJobs, setExpandedJobs] = useState<string[]>([])

  const toggleJobDetails = (jobId: string) => {
    setExpandedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const categoryGradients = {
    emergency: "from-red-500/20 via-pink-500/10 to-orange-500/20",
    maintenance: "from-blue-500/20 via-cyan-500/10 to-indigo-500/20",
    electrical: "from-yellow-500/20 via-amber-500/10 to-orange-500/20",
    hvac: "from-purple-500/20 via-violet-500/10 to-indigo-500/20",
    plumbing: "from-teal-500/20 via-cyan-500/10 to-blue-500/20",
  }

  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    ready: "bg-blue-100 text-blue-800",
    "in-progress": "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const sizeStyles = {
    S: "bg-green-100/80 text-green-700",
    M: "bg-blue-100/80 text-blue-700",
    L: "bg-orange-100/80 text-orange-700",
    XL: "bg-red-100/80 text-red-700",
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      emergency: <Zap className="w-4 h-4 text-red-500" />,
      maintenance: <Wrench className="w-4 h-4 text-blue-500" />,
      electrical: <Settings className="w-4 h-4 text-yellow-500" />,
      hvac: <AlertTriangle className="w-4 h-4 text-purple-500" />,
      plumbing: <Tool className="w-4 h-4 text-teal-500" />,
    }
    return icons[category as keyof typeof icons] || <Settings className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Multi-Select Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Active Jobs</h2>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-4 py-2">
            {jobs.length} jobs
          </Badge>
          {selectedJobs.length > 0 && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-3 py-1 animate-pulse">
              {selectedJobs.length} selected
            </Badge>
          )}
        </div>
        
        {/* Multi-Select Actions */}
        {selectedJobs.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Select all jobs
                const allJobIds = jobs.map(job => job.id);
                const newSelection = selectedJobs.length === jobs.length ? [] : allJobIds;
                newSelection.forEach(jobId => {
                  if (!selectedJobs.includes(jobId)) {
                    onJobSelect(jobId);
                  }
                });
                if (selectedJobs.length === jobs.length) {
                  selectedJobs.forEach(jobId => onJobSelect(jobId));
                }
              }}
              className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
            >
              {selectedJobs.length === jobs.length ? 'Deselect All' : 'Select All'}
            </Button>
            
            <Button
              size="sm"
              onClick={() => {
                selectedJobs.forEach(jobId => {
                  const job = jobs.find(j => j.id === jobId);
                  if (job && job.status === 'ready') {
                    onStatusUpdate(jobId, 'in-progress');
                  }
                });
              }}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <PlayCircle className="w-3 h-3 mr-1" />
              Start Selected ({selectedJobs.length})
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Clear selection
                selectedJobs.forEach(jobId => onJobSelect(jobId));
              }}
              className="bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>
      
      {/* Drag & Drop Instructions */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <GripVertical className="w-4 h-4" />
          <span className="font-medium">
            💡 Drag jobs to schedule them, click to expand details, use checkboxes for multi-select actions
          </span>
        </div>
      </div>

      {/* Responsive Job Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 auto-rows-max">
        {jobs.map((job) => {
          const isSelected = selectedJobs.includes(job.id)
          const isExpanded = expandedJobs.includes(job.id)
          const assignedTech = technicians.find((t) => t.id === job.assignedTo)
          const profitMargin = (((job.value - job.cost) / job.value) * 100).toFixed(1)
          const isOverdue = new Date() > job.dueDate && job.status !== "completed"

          return (
            <Card
              key={job.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(job));
                e.dataTransfer.effectAllowed = 'move';
                const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
                dragImage.style.opacity = '0.8';
                dragImage.style.transform = 'rotate(2deg)';
                e.dataTransfer.setDragImage(dragImage, 0, 0);
                console.log("Dragging job:", job.id);
              }}
              onDragEnd={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              className={`group transition-all duration-300 cursor-grab active:cursor-grabbing hover:cursor-pointer ${
                isSelected ? "ring-2 ring-blue-500 shadow-lg scale-105" : "hover:shadow-xl hover:scale-102"
              } bg-gradient-to-br ${categoryGradients[job.category]} backdrop-blur-sm border-0 ${
                isOverdue ? "ring-1 ring-red-400" : ""
              } ${isExpanded ? "shadow-2xl scale-105" : ""}`}
              onClick={() => toggleJobDetails(job.id)}
            >
              <CardHeader className="p-3 relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onJobSelect(job.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0"
                    />
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <div className="p-1 bg-white/80 rounded flex-shrink-0">{getCategoryIcon(job.category)}</div>
                      <h3 className="font-bold text-gray-800 text-xs truncate">{job.type}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <GripVertical className="w-3 h-3 text-gray-400" />
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs px-1 py-0 text-[10px]">
                        OVERDUE
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Customer */}
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <User className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.customer}</span>
                </div>

                {/* Job Number and Size */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Hash className="w-3 h-3 mr-1" />
                    <span className="font-mono text-[10px]">{job.id}</span>
                  </div>
                  <div className={`flex items-center text-xs font-bold rounded-full px-1.5 py-0.5 ${sizeStyles[job.size]}`}>
                    <Scale className="w-3 h-3 mr-1" />
                    {job.size}
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center justify-between">
                  <Badge className={`${statusColors[job.status]} border-0 text-xs px-2 py-0.5`}>
                    {job.status.replace("-", " ").toUpperCase()}
                  </Badge>

                  <div className="text-xs font-semibold text-green-600">${job.value}</div>
                </div>

                {/* Expanded Details with Animation */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="mt-4 pt-4 border-t border-white/30 space-y-3">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 bg-white/40 rounded-lg p-2">
                        <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        <span className="truncate font-medium">{job.location.address}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/40 rounded-lg p-2">
                        <Calendar className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="font-medium">{job.dueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/40 rounded-lg p-2">
                        <Clock className="w-3 h-3 text-orange-500 flex-shrink-0" />
                        <span className="font-medium">{job.estimatedDuration}min</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/40 rounded-lg p-2">
                        <DollarSign className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="font-medium">{profitMargin}% profit</span>
                      </div>
                    </div>

                    {/* Assigned Technician */}
                    {assignedTech && (
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-lg p-3 border border-blue-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-blue-900">{assignedTech.name}</div>
                            <div className="text-xs text-blue-700">{assignedTech.skills.slice(0, 2).join(", ")}</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            ${assignedTech.hourlyRate}/hr
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-white/60 hover:bg-white/80 transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Status Management Actions */}
                    <div className="bg-white/50 rounded-lg p-3 space-y-2">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Quick Actions</div>
                      <div className="grid grid-cols-2 gap-2">
                        {job.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              onStatusUpdate(job.id, "ready")
                            }}
                            className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                          >
                            <PlayCircle className="w-3 h-3 mr-1" />
                            Start Job
                          </Button>
                        )}

                        {job.status === "ready" && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onStatusUpdate(job.id, "in-progress")
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <PlayCircle className="w-3 h-3 mr-1" />
                            Begin Work
                          </Button>
                        )}

                        {job.status === "in-progress" && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onStatusUpdate(job.id, "completed")
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Complete
                          </Button>
                        )}

                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>

                        {!assignedTech && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              // This would open an assignment modal
                            }}
                          >
                            <User className="w-3 h-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
      
      {/* Enhanced Empty State */}
      {jobs.length === 0 && (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute top-2 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-2 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-700"></div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No active jobs at the moment. Your team is doing great work! 
            <br />New jobs will appear here when they're ready to be scheduled.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Job
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 