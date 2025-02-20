
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart, TrendingUp, CircleDollarSign, UserCheck, CheckSquare,
  Clock, Calendar, Upload, User, PlusCircle
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTeam: string;
  status: 'pending' | 'acknowledged' | 'completed';
  acknowledgmentNote?: string;
  completionNote?: string;
  completionImages?: string[];
  assignedManager: string;
}

const keyStatistics = [
  {
    title: "Monthly Revenue",
    value: "$45,289",
    change: "+12.5%",
    trend: "up",
    icon: BarChart,
    description: "vs. last month"
  },
  {
    title: "Active Jobs",
    value: "24",
    change: "+4",
    trend: "up",
    icon: TrendingUp,
    description: "vs. last week"
  },
  {
    title: "Customer Satisfaction",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: UserCheck,
    description: "based on recent reviews"
  },
  {
    title: "Outstanding Payments",
    value: "$12,450",
    change: "-15%",
    trend: "down",
    icon: CircleDollarSign,
    description: "vs. last month"
  }
];

const teams = ['Red Team', 'Blue Team', 'Green Team'];

export default function StatisticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTeam: '',
    assignedManager: ''
  });
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate || !newTask.assignedTeam) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      ...newTask,
      status: 'pending'
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      assignedTeam: '',
      assignedManager: ''
    });

    toast({
      title: "Task Added",
      description: "New task has been created successfully"
    });
  };

  const handleTaskAcknowledgment = (taskId: string, note: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'acknowledged', acknowledgmentNote: note }
        : task
    ));
    toast({
      title: "Task Acknowledged",
      description: "Task has been marked as acknowledged"
    });
  };

  const handleTaskCompletion = (taskId: string, note: string, images: string[]) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completionNote: note, completionImages: images }
        : task
    ));
    toast({
      title: "Task Completed",
      description: "Task has been marked as completed"
    });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Business Statistics & Team Tasks</h1>
          </div>
        </div>

        {/* Key Statistics Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Key Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyStatistics.map((stat) => (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="space-y-0 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Tasks Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Team Tasks</h2>
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList>
              <TabsTrigger value="create">Create Task</TabsTrigger>
              <TabsTrigger value="red">Red Team</TabsTrigger>
              <TabsTrigger value="blue">Blue Team</TabsTrigger>
              <TabsTrigger value="green">Green Team</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Task</CardTitle>
                  <CardDescription>Assign a new task to a team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Task Title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Task Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newTask.assignedTeam}
                      onChange={(e) => setNewTask({...newTask, assignedTeam: e.target.value})}
                    >
                      <option value="">Select Team</option>
                      {teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleAddTask} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {teams.map(team => (
              <TabsContent key={team} value={team.toLowerCase().split(' ')[0]} className="space-y-4">
                <div className="grid gap-4">
                  {tasks
                    .filter(task => task.assignedTeam === team)
                    .map(task => (
                      <Card key={task.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{task.title}</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </span>
                          </div>
                          <CardDescription>Due by: {task.dueDate}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p>{task.description}</p>
                          {task.status === 'pending' && (
                            <Button
                              variant="outline"
                              onClick={() => handleTaskAcknowledgment(task.id, "Task received and understood")}
                            >
                              <CheckSquare className="mr-2 h-4 w-4" />
                              Acknowledge Task
                            </Button>
                          )}
                          {task.status === 'acknowledged' && (
                            <Button
                              onClick={() => handleTaskCompletion(task.id, "Task completed successfully", [])}
                            >
                              <CheckSquare className="mr-2 h-4 w-4" />
                              Mark as Completed
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
