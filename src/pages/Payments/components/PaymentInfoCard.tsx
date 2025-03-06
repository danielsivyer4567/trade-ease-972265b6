import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@lottiefiles/react-lottie-player";
export function PaymentInfoCard() {
  return <div className="mb-6">
      <Card>
        <CardContent className="p-4 py-0">
          <div className="flex flex-col gap-4 py-0 px-px">
            <div className="mx-px py-[2px] my-0 px-[240px]">
              <h3 className="text-xl font-medium px-[2px] mx-[2px] my-0 py-0">How Tap on Mobile works</h3>
              <p className="text-gray-600">Open the app, type the amount, ask the customer to tap – it's that simple.</p>
            </div>
            <div className="flex justify-center px-0 py-px my-0 mx-[227px]">
              <Player src="https://assets10.lottiefiles.com/packages/lf20_M9p23l.json" className="w-[300px] h-[300px]" loop autoplay background="transparent" speed={1} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}