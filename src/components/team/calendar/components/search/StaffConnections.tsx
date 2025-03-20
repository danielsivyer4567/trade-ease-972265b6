
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Users } from 'lucide-react';

// Define interfaces for staff members and teams
interface TeamMember {
  id: number;
  name: string;
  role: string;
  teamId: string | null;
}

interface Team {
  id: string;
  name: string;
  color: string;
}

export const StaffConnections: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Sample data for teams (matching the structure in the Calendar page)
  const teams: Team[] = [
    { id: 'red', name: 'Red Team', color: 'text-red-500' },
    { id: 'blue', name: 'Blue Team', color: 'text-blue-500' },
    { id: 'green', name: 'Green Team', color: 'text-green-500' }
  ];
  
  // Sample staff members with team allocations
  const staffMembers: TeamMember[] = [
    { id: 1, name: 'John Smith', role: 'Technician', teamId: 'red' },
    { id: 2, name: 'Sarah Johnson', role: 'Electrician', teamId: 'blue' },
    { id: 3, name: 'Mike Williams', role: 'Plumber', teamId: 'green' },
    { id: 4, name: 'Lisa Brown', role: 'HVAC Specialist', teamId: null },
    { id: 5, name: 'Robert Davis', role: 'Carpenter', teamId: null },
  ];
  
  // Filter staff members based on search query
  const filteredStaff = searchQuery.trim() === '' 
    ? [] 
    : staffMembers.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Find team for a staff member
  const getTeamForMember = (teamId: string | null): Team | undefined => {
    if (!teamId) return undefined;
    return teams.find(team => team.id === teamId);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.trim() !== '');
  };

  return (
    <div className="my-[8px] py-0">
      <label className="block text-xs font-medium mb-1 text-gray-500">Staff & Connections</label>
      <div className="flex py-px px-0 my-0 mx-[4px] relative">
        <div className="relative flex-grow">
          <Input 
            placeholder="Add staff members or connections..." 
            className="w-full border-gray-300 h-7 text-xs bg-slate-300 py-[25px] my-0 px-[14px] mx-[3px] pl-8" 
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowResults(searchQuery.trim() !== '')}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-1 border-gray-300 h-7 w-7 p-0 bg-slate-400 hover:bg-slate-300 my-0 py-[25px] mx-[11px] px-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
        
        {/* Search results dropdown */}
        {showResults && filteredStaff.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
            {filteredStaff.map((member) => {
              const team = getTeamForMember(member.teamId);
              return (
                <div 
                  key={member.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{member.name}</span>
                      {team && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border flex items-center ${team.color}`}>
                          <Users className="h-3 w-3 mr-1" />
                          {team.name}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{member.role}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 h-6 flex-shrink-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
