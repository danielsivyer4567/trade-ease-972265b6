
import React from "react";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function RecurringJobsTab() {
  return (
    <>
      <Separator className="h-[2px] bg-gray-400 my-[8px]" />
      <SectionHeader title="Recurring Jobs" className="ml-0 mt-2 mb-2" />
      <Card>
        <CardHeader>
          <CardTitle>Recurring Jobs</CardTitle>
          <CardDescription>
            Set up jobs that automatically repeat on a schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No recurring jobs have been set up yet.</p>
        </CardContent>
      </Card>
    </>
  );
}
