
import { AppLayout } from "@/components/ui/AppLayout"
import { SMSForm } from "@/components/communication/SMSForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function CommunicationsPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Communications</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send SMS</CardTitle>
            <CardDescription>
              Send SMS messages to your customers or team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SMSForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
