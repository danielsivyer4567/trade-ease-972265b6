
import React, { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDraggableTag } from '@/hooks/useDraggableTag';
import { cn } from '@/lib/utils';
import { TeamMember } from './types';

const demoUsers: TeamMember[] = [
  { id: 1, name: "John Doe", avatar: "/placeholder.svg", role: "Admin" },
  { id: 2, name: "Jane Smith", avatar: "/placeholder.svg", role: "Manager" },
  { id: 3, name: "Robert Johnson", avatar: "/placeholder.svg", role: "Developer" },
  { id: 4, name: "Emily Davis", avatar: "/placeholder.svg", role: "Designer" },
];

export function TagUserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { startTagging } = useDraggableTag();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8 flex items-center justify-center"
          title="Tag a User"
        >
          <User className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        <div className="space-y-1">
          <h3 className="font-medium text-sm px-2 py-1.5">Tag a Team Member</h3>
          <div className="border-t"></div>
          <div className="max-h-60 overflow-auto">
            {demoUsers.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab",
                  "hover:bg-secondary transition-colors"
                )}
                draggable
                onDragStart={(e) => startTagging(e, user)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
