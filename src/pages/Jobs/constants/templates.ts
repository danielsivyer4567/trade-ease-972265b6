
import { JobTemplate } from "@/types/job";

export const QUICK_TEMPLATES: JobTemplate[] = [{
  id: "t1",
  title: "Basic Maintenance",
  description: "Standard maintenance service",
  type: "General Repair",
  estimatedDuration: 1,
  price: 100,
  materials: ["Basic tools"]
}, {
  id: "t2",
  title: "Emergency Plumbing",
  description: "Urgent plumbing repair for leaks or blockages",
  type: "Plumbing",
  estimatedDuration: 2,
  price: 200,
  materials: ["Pipes", "Fittings"]
}, {
  id: "t3",
  title: "Electrical Inspection",
  description: "Safety inspection of electrical systems",
  type: "Electrical",
  estimatedDuration: 1.5,
  price: 150,
  materials: ["Testing equipment"]
}];
