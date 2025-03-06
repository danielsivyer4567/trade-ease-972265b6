
import { Card, CardContent } from "@/components/ui/card";

export function PaymentInfoCard() {
  return <div className="mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 px-0 py-0">
            <div className="mx-0 py-0 my-0 px-0 text-left">
              <h3 className="text-xl font-medium px-0 mx-0 my-0 py-0">How Tap on Mobile works</h3>
              <p className="text-gray-600">Open the app, type the amount, ask the customer to tap – it's that simple.</p>
            </div>
            <div className="flex justify-start mx-0 my-0 py-0 px-0">
              <img 
                src="/file-Ckt7RhAcT345qRhFkib3VN" 
                alt="Tap on Mobile animation" 
                className="w-[300px] h-auto" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}
