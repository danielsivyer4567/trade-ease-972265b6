
import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useState } from "react";

export function PaymentInfoCard() {
  const [animationSrc, setAnimationSrc] = useState<string>("https://assets9.lottiefiles.com/packages/lf20_plyplrrw.json");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to load the animation and fallback to alternative if it fails
    const checkAnimation = async () => {
      try {
        const response = await fetch(animationSrc);
        if (!response.ok) {
          // Fallback to another animation if the first one fails
          setAnimationSrc("https://assets3.lottiefiles.com/packages/lf20_kcsr6fcp.json");
        }
      } catch (error) {
        console.error("Error loading animation:", error);
        setAnimationSrc("https://assets3.lottiefiles.com/packages/lf20_kcsr6fcp.json");
      } finally {
        setIsLoading(false);
      }
    };

    checkAnimation();
  }, [animationSrc]);

  return (
    <div className="mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {isLoading ? (
                <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <span className="text-gray-500">Loading animation...</span>
                </div>
              ) : (
                <Player
                  src={animationSrc}
                  className="w-[300px] h-[300px]"
                  loop
                  autoplay
                  background="transparent"
                  speed={1}
                  onEvent={event => {
                    if (event === 'error') {
                      console.error("Lottie animation error");
                      setAnimationSrc("https://assets10.lottiefiles.com/private_files/lf30_fw8rfnb9.json");
                    }
                  }}
                />
              )}
              <div className="md:flex-1 text-center md:text-left">
                <h3 className="text-xl font-medium">How Tap on Mobile works</h3>
                <p className="text-gray-600">Open the app, type the amount, ask the customer to tap – it's that simple.</p>
                <ul className="mt-4 text-gray-600 text-left space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">1.</span>
                    <span>Enter the payment amount in the app</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">2.</span>
                    <span>Customer taps their card or device on your phone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">3.</span>
                    <span>Payment processes securely and receipt is generated</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
