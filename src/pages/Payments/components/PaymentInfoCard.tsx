
import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@lottiefiles/react-lottie-player";

export function PaymentInfoCard() {
  return <div className="mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex-shrink-0">
              <Player 
                src="https://assets10.lottiefiles.com/packages/lf20_M9p23l.json" 
                className="w-[180px] h-[180px]" 
                loop 
                autoplay 
                background="transparent" 
                speed={1} 
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-2">How Tap on Mobile works</h3>
              <p className="text-gray-600">Open the app, type the amount, ask the customer to tap – it's that simple.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}
