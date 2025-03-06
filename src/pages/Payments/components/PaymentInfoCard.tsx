
import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@lottiefiles/react-lottie-player";

export function PaymentInfoCard() {
  return (
    <div className="mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Player
                src="/content/dam/anzworldline/images/website-development/LOTTIE_TAPONMOBILE.json"
                className="w-[300px] h-[300px]"
                loop
                autoplay
                background="transparent"
                speed={1}
              />
              <div>
                <h3 className="text-xl font-medium">How Tap on Mobile works</h3>
                <p className="text-gray-600">Open the app, type the amount, ask the customer to tap – it's that simple.</p>
              </div>
            </div>
            <img 
              src="/lovable-uploads/ae10fa3d-7775-4ca4-88a6-7755f3022211.png" 
              alt="Payment processing" 
              className="max-w-full rounded-lg max-h-40"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
