
import React from "react";
import { ChevronRight } from "lucide-react";

export function AvailableResourcesList() {
  // Sample teams and employees
  const teams = [
    {
      id: 1,
      name: "Simon and apprentice",
      selected: false
    },
    {
      id: 2,
      name: "Jack, Terry and excavator",
      selected: false
    }
  ];
  
  const employees = [
    { id: 1, role: "Technician AM", hours: "0.00" },
    { id: 2, role: "Technician AS", hours: "0.00" },
    { id: 3, role: "Technician DH", hours: "0.00" },
    { id: 4, role: "Technician HS", hours: "0.00" },
    { id: 5, role: "Technician JS", hours: "0.00" },
    { id: 6, role: "Technician LM", hours: "0.00" },
    { id: 7, role: "Technician PS", hours: "0.00" },
    { id: 8, role: "Technician RJ", hours: "0.00" },
    { id: 9, role: "Technician SJ", hours: "0.00" },
    { id: 10, role: "Technician VS", hours: "0.00" },
    { id: 11, role: "Administrator RL", hours: "0.00" },
    { id: 12, role: "Trade Technician", hours: "0.00" },
    { id: 13, role: "Technician AA", hours: "0.00" },
    { id: 14, role: "Technician BH", hours: "0.00" }
  ];
  
  return (
    <div>
      <div className="mb-4">
        <h4 className="bg-blue-100 text-blue-800 py-1 px-2 text-sm font-medium mb-2">Teams</h4>
        {teams.map(team => (
          <div key={team.id} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50">
            <span className="text-sm">{team.name}</span>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <div className="bg-blue-100 text-blue-800 py-1 px-2 text-sm font-medium mb-2 flex justify-between">
          <span>Employees</span>
          <span>Hrs</span>
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {employees.map(employee => (
            <div key={employee.id} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50">
              <span className="text-sm">{employee.role}</span>
              <div className="flex items-center">
                <span className="text-sm mr-2">{employee.hours}</span>
                <input type="checkbox" className="mr-2" />
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
