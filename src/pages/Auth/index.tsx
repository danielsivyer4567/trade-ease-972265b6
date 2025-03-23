import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { AuthError } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

// Components
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import VerificationStatus from "./components/VerificationStatus";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >();
  const [verificationMessage, setVerificationMessage] = useState("");
  const { signUp, signIn, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      await signUp(email, password, fullName);
      setEmail(email);
      setVerificationSent(true);
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message || "Failed to sign in",
        variant: "destructive",
      });
    }
  };

  const handleResendVerification = async () => {
    try {
      await resetPassword(email);
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message || "Failed to send verification email",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/hardworking.png"
            alt="Hardworking Professional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-900/80" />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            width="140"
            height="27"
            viewBox="0 0 140 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="TradeEase Logo"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.2588 11.5294C19.2588 15.7982 15.7982 19.2588 11.5294 19.2588C7.26058 19.2588 3.8 15.7982 3.8 11.5294C3.8 7.26058 7.26058 3.8 11.5294 3.8C15.7982 3.8 19.2588 7.26058 19.2588 11.5294ZM14.6248 22.6386C19.4891 21.2861 23.0588 16.8246 23.0588 11.5294C23.0588 5.16189 17.8969 0 11.5294 0C5.16189 0 0 5.16189 0 11.5294C0 16.8246 3.56974 21.2861 8.43398 22.6386L10.6634 26.5C11.0483 27.1667 12.0105 27.1667 12.3954 26.5L14.6248 22.6386Z"
              fill="white"
            />
            <path
              d="M40.9611 5.24933V8.3H36.5931V21.4271H33.4037V8.3H29.0588V5.24933H40.9611Z"
              fill="white"
            />
            <path
              d="M44.1172 11.8591C44.3945 11.1196 44.849 10.5649 45.4807 10.1951C46.1278 9.82533 46.8443 9.64044 47.6301 9.64044V12.9684C46.721 12.8606 45.9044 13.0455 45.1803 13.5231C44.4715 14.0007 44.1172 14.7942 44.1172 15.9036V21.4271H41.1358V9.87155H44.1172V11.8591Z"
              fill="white"
            />
            <path
              d="M57.7271 9.87155H60.7084V21.4271H57.7271V20.0636C56.8335 21.1883 55.5778 21.7507 53.96 21.7507C52.4192 21.7507 51.0942 21.1652 49.9849 19.9942C48.8909 18.8078 48.344 17.3596 48.344 15.6493C48.344 13.9391 48.8909 12.4985 49.9849 11.3276C51.0942 10.1412 52.4192 9.548 53.96 9.548C55.5778 9.548 56.8335 10.1104 57.7271 11.2351V9.87155ZM52.2266 18.0067C52.8275 18.6076 53.5902 18.908 54.5146 18.908C55.4391 18.908 56.2018 18.6076 56.8026 18.0067C57.4189 17.3904 57.7271 16.6046 57.7271 15.6493C57.7271 14.6941 57.4189 13.916 56.8026 13.3151C56.2018 12.6988 55.4391 12.3907 54.5146 12.3907C53.5902 12.3907 52.8275 12.6988 52.2266 13.3151C51.6258 13.916 51.3253 14.6941 51.3253 15.6493C51.3253 16.6046 51.6258 17.3904 52.2266 18.0067Z"
              fill="white"
            />
            <path
              d="M72.171 5.24933H75.1523V21.4271H72.171V20.0636C71.2928 21.1883 70.0448 21.7507 68.427 21.7507C66.8708 21.7507 65.5381 21.1652 64.4288 19.9942C63.3348 18.8078 62.7879 17.3596 62.7879 15.6493C62.7879 13.9391 63.3348 12.4985 64.4288 11.3276C65.5381 10.1412 66.8708 9.548 68.427 9.548C70.0448 9.548 71.2928 10.1104 72.171 11.2351V5.24933ZM66.6705 18.0067C67.2868 18.6076 68.0572 18.908 68.9817 18.908C69.9061 18.908 70.6688 18.6076 71.2697 18.0067C71.8705 17.3904 72.171 16.6046 72.171 15.6493C72.171 14.6941 71.8705 13.916 71.2697 13.3151C70.6688 12.6988 69.9061 12.3907 68.9817 12.3907C68.0572 12.3907 67.2868 12.6988 66.6705 13.3151C66.0697 13.916 65.7692 14.6941 65.7692 15.6493C65.7692 16.6046 66.0697 17.3904 66.6705 18.0067Z"
              fill="white"
            />
            <path
              d="M80.398 16.8742C80.7986 18.3225 81.8848 19.0467 83.6567 19.0467C84.7968 19.0467 85.6596 18.6615 86.2451 17.8911L88.6487 19.2778C87.5085 20.9264 85.8291 21.7507 83.6104 21.7507C81.6999 21.7507 80.1669 21.1729 79.0113 20.0173C77.8558 18.8618 77.278 17.4058 77.278 15.6493C77.278 13.9083 77.8481 12.46 78.9882 11.3044C80.1284 10.1335 81.5921 9.548 83.3793 9.548C85.0741 9.548 86.4685 10.1335 87.5624 11.3044C88.6718 12.4754 89.2264 13.9237 89.2264 15.6493C89.2264 16.0345 89.1879 16.4428 89.1109 16.8742H80.398ZM80.3518 14.5631H86.2451C86.0756 13.7773 85.7213 13.1918 85.182 12.8067C84.6582 12.4215 84.0573 12.2289 83.3793 12.2289C82.5781 12.2289 81.9156 12.4369 81.3918 12.8529C80.8679 13.2535 80.5213 13.8236 80.3518 14.5631Z"
              fill="white"
            />
            <path
              d="M94.6357 18.3764H101.453V21.4271H91.4464V5.24933H101.338V8.3H94.6357V11.7436H100.76V14.748H94.6357V18.3764Z"
              fill="white"
            />
            <path
              d="M112.097 9.87155H115.078V21.4271H112.097V20.0636C111.203 21.1883 109.948 21.7507 108.33 21.7507C106.789 21.7507 105.464 21.1652 104.355 19.9942C103.261 18.8078 102.714 17.3596 102.714 15.6493C102.714 13.9391 103.261 12.4985 104.355 11.3276C105.464 10.1412 106.789 9.548 108.33 9.548C109.948 9.548 111.203 10.1104 112.097 11.2351V9.87155ZM106.596 18.0067C107.197 18.6076 107.96 18.908 108.884 18.908C109.809 18.908 110.572 18.6076 111.172 18.0067C111.789 17.3904 112.097 16.6046 112.097 15.6493C112.097 14.6941 111.789 13.916 111.172 13.3151C110.572 12.6988 109.809 12.3907 108.884 12.3907C107.96 12.3907 107.197 12.6988 106.596 13.3151C105.996 13.916 105.695 14.6941 105.695 15.6493C105.695 16.6046 105.996 17.3904 106.596 18.0067Z"
              fill="white"
            />
            <path
              d="M120.442 13.1533C120.442 13.4615 120.642 13.7157 121.042 13.916C121.458 14.1009 121.959 14.2704 122.545 14.4244C123.13 14.5631 123.716 14.748 124.301 14.9791C124.887 15.1948 125.38 15.5646 125.78 16.0884C126.196 16.6123 126.404 17.2671 126.404 18.0529C126.404 19.2393 125.957 20.156 125.064 20.8031C124.186 21.4348 123.084 21.7507 121.759 21.7507C119.386 21.7507 117.768 20.8339 116.906 19.0004L119.494 17.5444C119.833 18.5459 120.588 19.0467 121.759 19.0467C122.822 19.0467 123.354 18.7154 123.354 18.0529C123.354 17.7447 123.146 17.4982 122.73 17.3133C122.329 17.113 121.836 16.9358 121.25 16.7818C120.665 16.6277 120.08 16.4351 119.494 16.204C118.909 15.9729 118.408 15.6108 117.992 15.1178C117.591 14.6093 117.391 13.9776 117.391 13.2227C117.391 12.0825 117.807 11.1889 118.639 10.5418C119.486 9.87926 120.534 9.548 121.782 9.548C122.722 9.548 123.577 9.7637 124.347 10.1951C125.118 10.6111 125.726 11.212 126.173 11.9978L123.631 13.3844C123.261 12.5987 122.645 12.2058 121.782 12.2058C121.397 12.2058 121.073 12.2905 120.811 12.46C120.565 12.6295 120.442 12.8606 120.442 13.1533Z"
              fill="white"
            />
            <path
              d="M130.683 16.8742C131.083 18.3225 132.17 19.0467 133.941 19.0467C135.082 19.0467 135.944 18.6615 136.53 17.8911L138.933 19.2778C137.793 20.9264 136.114 21.7507 133.895 21.7507C131.985 21.7507 130.452 21.1729 129.296 20.0173C128.14 18.8618 127.563 17.4058 127.563 15.6493C127.563 13.9083 128.133 12.46 129.273 11.3044C130.413 10.1335 131.877 9.548 133.664 9.548C135.359 9.548 136.753 10.1335 137.847 11.3044C138.956 12.4754 139.511 13.9237 139.511 15.6493C139.511 16.0345 139.473 16.4428 139.396 16.8742H130.683ZM130.636 14.5631H136.53C136.36 13.7773 136.006 13.1918 135.467 12.8067C134.943 12.4215 134.342 12.2289 133.664 12.2289C132.863 12.2289 132.2 12.4369 131.676 12.8529C131.153 13.2535 130.806 13.8236 130.636 14.5631Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.71523 12.2858C5.15042 11.6468 5.15042 10.687 5.71523 10.0479L7.70651 7.79478C8.15315 7.28941 8.79518 7 9.46962 7H9.92114C10.3085 7 10.6772 7.16622 10.9337 7.45647C11.3855 7.96759 11.3855 8.73521 10.9337 9.24632L10.4339 9.81194C10.4793 9.84695 10.5228 9.88556 10.5641 9.92778L11.9463 11.3418L12.1177 11.1728C12.2553 11.0341 12.3072 10.7974 12.2571 10.5289C12.1817 10.1271 12.2045 9.71317 12.3234 9.32211C12.4423 8.93106 12.6538 8.57449 12.94 8.28267C13.2262 7.99086 13.5786 7.77243 13.9672 7.64594C14.3559 7.51945 14.7693 7.48864 15.1724 7.55613C15.2896 7.57416 15.3986 7.62707 15.4853 7.70795C15.5719 7.78883 15.6322 7.89393 15.6583 8.00956C15.7077 8.2225 15.6444 8.45683 15.4766 8.62609L14.4767 9.63488C14.463 9.64941 14.4553 9.66866 14.4554 9.68865C14.4555 9.70865 14.4633 9.72784 14.4772 9.74224L15.0749 10.3349C15.0894 10.3487 15.1087 10.3563 15.1287 10.3562C15.1487 10.3561 15.1679 10.3483 15.1823 10.3345L16.1825 9.32648C16.261 9.24604 16.3585 9.18673 16.466 9.15405C16.5735 9.12137 16.6875 9.11638 16.7975 9.13953C17.0187 9.18872 17.2089 9.35922 17.2554 9.62111C17.3265 10.0237 17.2993 10.4375 17.1762 10.8273C17.0531 11.2171 16.8377 11.5714 16.5483 11.8602C16.2589 12.1489 15.904 12.3635 15.5139 12.4856C15.1238 12.6078 14.71 12.634 14.3076 12.562C14.0382 12.5138 13.8023 12.5673 13.6648 12.7064L13.4689 12.8995L15.1351 14.604C15.6069 15.0867 15.6025 15.8592 15.1252 16.3365C14.6402 16.8215 13.8524 16.817 13.373 16.3265L11.7138 14.6291L9.82521 16.4904C9.62011 16.6871 9.34625 16.7959 9.06207 16.7935C8.77789 16.7911 8.50588 16.6778 8.30407 16.4777C8.10226 16.2776 7.98664 16.0066 7.98187 15.7224C7.97709 15.4383 8.08355 15.1635 8.27852 14.9567L10.1913 13.0715L8.80576 11.6541L8.24745 12.2858C7.5749 13.0468 6.38779 13.0468 5.71523 12.2858Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "TradeEase has revolutionized how we manage our international
              trade operations. The platform's intuitive design and powerful
              features have made our workflow significantly more efficient."
            </p>
            <footer className="text-sm">
              Sofia Davis - Trade Operations Manager
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {showForgotPassword ? "Reset Password" : "Welcome"}
              </CardTitle>
              <CardDescription className="text-center">
                {showForgotPassword
                  ? "Enter your email to reset your password"
                  : "Sign in to your account or create a new one"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verificationSent ? (
                <VerificationStatus
                  email={email}
                  verificationSent={verificationSent}
                  status={verificationStatus}
                  message={verificationMessage}
                  onResend={handleResendVerification}
                />
              ) : showForgotPassword ? (
                <div className="space-y-4">
                  <ForgotPasswordForm />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleBackToSignIn}
                  >
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <div className="min-h-[320px]">
                    <TabsContent value="signin" className="mt-0">
                      <SignInForm
                        onSubmit={handleSignIn}
                        onForgotPassword={handleForgotPassword}
                      />
                    </TabsContent>
                    <TabsContent value="signup" className="mt-0">
                      <SignUpForm
                        onSubmit={handleSignUp}
                        fullName={fullName}
                        setFullName={setFullName}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
