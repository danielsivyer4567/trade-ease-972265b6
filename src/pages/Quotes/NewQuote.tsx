import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Settings } from "lucide-react";
export default function NewQuote() {
  const navigate = useNavigate();
  return <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Create New Quote</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/jobs/template/new")}>
            <div className="text-center space-y-4">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <Settings className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg">Build New Template</h3>
              <p className="text-sm text-gray-500">Create a new quote template from scratch</p>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center space-y-4">
              <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg">Use Template</h3>
              <p className="text-sm text-gray-500">Create a quote from an existing template</p>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                From Template
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center space-y-4">
              <div className="bg-purple-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <Plus className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg">New Quote from scratch</h3>
              <p className="text-sm text-gray-500">Create a quote without a template</p>
              <Button variant="outline" className="w-full">
                Create Quote
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>;
}