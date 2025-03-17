
import React from "react";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ServiceRemindersTab() {
  return (
    <>
      <Separator className="h-[2px] bg-gray-400 my-[8px]" />
      <SectionHeader title="Service Reminders" className="ml-0 mt-2 mb-2" />
      <Card>
        <CardHeader>
          <CardTitle>Service Reminders</CardTitle>
          <CardDescription>
            Set up recurring service reminders for your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No service reminders have been set up yet.</p>
        </CardContent>
      </Card>
    </>
  );
}
