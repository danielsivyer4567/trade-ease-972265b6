
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Job, Rate } from "../types";

interface JobSearchProps {
  onJobSelect: (job: Job, matchingRate: Rate | undefined) => void;
  availableRates: Rate[];
}

export function JobSearch({ onJobSelect, availableRates }: JobSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock jobs data - in a real app, this would come from your backend
  const mockJobs: Job[] = [
    {
      id: "1",
      jobNumber: "JOB-001",
      title: "Large Room Painting",
      measurements: {
        squareMeters: 45.5,
      }
    },
    {
      id: "2",
      jobNumber: "JOB-002",
      title: "Fence Installation",
      measurements: {
        linealMeters: 25.0,
      }
    },
    {
      id: "3",
      jobNumber: "JOB-003",
      title: "Window Installation",
      measurements: {
        items: 8,
      }
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredJobs = mockJobs.filter(job => 
    job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJobClick = (job: Job) => {
    // Find matching rate based on job measurements
    let matchingRate: Rate | undefined;
    if (job.measurements.squareMeters) {
      matchingRate = availableRates.find(rate => rate.unit === "per m²");
    } else if (job.measurements.linealMeters) {
      matchingRate = availableRates.find(rate => rate.unit === "per lineal meter");
    } else if (job.measurements.items) {
      matchingRate = availableRates.find(rate => rate.unit === "per item");
    } else if (job.measurements.hours) {
      matchingRate = availableRates.find(rate => rate.unit === "per hour");
    }

    onJobSelect(job, matchingRate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by job number or title..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <div className="space-y-2">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleJobClick(job)}
              >
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-gray-500">#{job.jobNumber}</p>
                <div className="text-sm text-gray-600 mt-1">
                  {job.measurements.squareMeters && `${job.measurements.squareMeters} m²`}
                  {job.measurements.linealMeters && `${job.measurements.linealMeters} lineal meters`}
                  {job.measurements.items && `${job.measurements.items} items`}
                  {job.measurements.hours && `${job.measurements.hours} hours`}
                </div>
              </div>
            ))}
            {filteredJobs.length === 0 && (
              <p className="text-center text-gray-500 py-2">No jobs found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
