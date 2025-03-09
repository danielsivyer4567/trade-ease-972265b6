
import { ClipboardCopy, FileLock, FileText, Info, Link2, Shield } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function TermsOfService() {
  const { toast } = useToast();

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description
    });
  };

  return (
    <SettingsPageTemplate
      title="Terms of Service & Privacy"
      icon={<FileText className="h-6 w-6 text-blue-600" />}
    >
      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
          <TabsTrigger value="urls">Authorization URLs</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-4">
                <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
                <p>
                  By accessing or using Trade Ease services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>

                <h3 className="font-semibold text-lg">2. Description of Service</h3>
                <p>
                  Trade Ease provides a platform for trade professionals to manage their business operations, including but not limited to job management, customer relationship management, quotes, invoices, and scheduling.
                </p>

                <h3 className="font-semibold text-lg">3. User Accounts</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>

                <h3 className="font-semibold text-lg">4. Billing and Payments</h3>
                <p>
                  Users with paid subscriptions agree to pay all fees associated with the service plan selected. All fees are exclusive of taxes unless stated otherwise. Subscription fees are non-refundable except as required by law or as explicitly stated in these terms.
                </p>

                <h3 className="font-semibold text-lg">5. Termination</h3>
                <p>
                  We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                </p>

                <h3 className="font-semibold text-lg">6. Modifications to the Service</h3>
                <p>
                  We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that we shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.
                </p>

                <h3 className="font-semibold text-lg">7. Disclaimer of Warranties</h3>
                <p>
                  The service is provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>

                <h3 className="font-semibold text-lg">8. Limitation of Liability</h3>
                <p>
                  In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </p>

                <h3 className="font-semibold text-lg">9. Governing Law</h3>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the company is registered, without regard to its conflict of law provisions.
                </p>

                <h3 className="font-semibold text-lg">10. Changes to Terms</h3>
                <p>
                  We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of the service following any changes constitutes your acceptance of the new Terms.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-4">
                <h3 className="font-semibold text-lg">1. Information We Collect</h3>
                <p>
                  We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise contact us.
                </p>

                <h3 className="font-semibold text-lg">2. How We Use Your Information</h3>
                <p>
                  We use personal information collected via our service for a variety of business purposes, including to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide, operate, and maintain our service</li>
                  <li>Improve, personalize, and expand our service</li>
                  <li>Understand and analyze how you use our service</li>
                  <li>Develop new products, services, features, and functionality</li>
                  <li>Communicate with you, including for customer service, to provide updates and other information</li>
                  <li>Process your transactions</li>
                  <li>Find and prevent fraud</li>
                </ul>

                <h3 className="font-semibold text-lg">3. Sharing Your Information</h3>
                <p>
                  We may share your information with third parties in the following situations:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>With service providers to facilitate our service</li>
                  <li>With business partners to offer certain products, services or promotions</li>
                  <li>With other users when you share information through the service</li>
                  <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition</li>
                  <li>If we believe disclosure is necessary to protect our rights or comply with legal process</li>
                </ul>

                <h3 className="font-semibold text-lg">4. Your Privacy Rights</h3>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, such as the right to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access the personal information we have about you</li>
                  <li>Correct inaccuracies in your personal information</li>
                  <li>Delete your personal information</li>
                  <li>Object to the processing of your personal information</li>
                  <li>Export your personal information in a portable format</li>
                </ul>

                <h3 className="font-semibold text-lg">5. Data Retention</h3>
                <p>
                  We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
                </p>

                <h3 className="font-semibold text-lg">6. Security</h3>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
                </p>

                <h3 className="font-semibold text-lg">7. Changes to Privacy Policy</h3>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cookies" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-amber-600" />
                Cookie Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-4">
                <h3 className="font-semibold text-lg">1. What Are Cookies</h3>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
                </p>

                <h3 className="font-semibold text-lg">2. How We Use Cookies</h3>
                <p>
                  We use cookies for several reasons. Some cookies are required for technical reasons for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website.
                </p>

                <h3 className="font-semibold text-lg">3. Types of Cookies We Use</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Essential cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems.</li>
                  <li><strong>Performance cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
                  <li><strong>Functional cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization.</li>
                  <li><strong>Targeting cookies:</strong> These cookies may be set through our site by our advertising partners to build a profile of your interests.</li>
                </ul>

                <h3 className="font-semibold text-lg">4. Managing Cookies</h3>
                <p>
                  Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you.
                </p>

                <h3 className="font-semibold text-lg">5. Changes to Cookie Policy</h3>
                <p>
                  We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
                </p>

                <h3 className="font-semibold text-lg">6. Contact Us</h3>
                <p>
                  If you have any questions about our use of cookies, please contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urls" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-purple-600" />
                Authorization URLs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-base">Authorization URL</h3>
                <p className="text-sm text-gray-500">
                  Use this URL to authorize external services to connect to your Trade Ease account.
                </p>
                <div className="flex items-center mt-1 p-2 bg-gray-100 rounded-md">
                  <code className="text-sm flex-1 overflow-x-auto">
                    https://api.tradeease.com/auth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 flex-shrink-0"
                    onClick={() => copyToClipboard(
                      "https://api.tradeease.com/auth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI",
                      "Authorization URL copied to clipboard"
                    )}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-base">Deauthorization URL</h3>
                <p className="text-sm text-gray-500">
                  Use this URL to revoke access for external services connected to your Trade Ease account.
                </p>
                <div className="flex items-center mt-1 p-2 bg-gray-100 rounded-md">
                  <code className="text-sm flex-1 overflow-x-auto">
                    https://api.tradeease.com/auth/deauthorize?client_id=YOUR_CLIENT_ID&token=YOUR_ACCESS_TOKEN
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 flex-shrink-0"
                    onClick={() => copyToClipboard(
                      "https://api.tradeease.com/auth/deauthorize?client_id=YOUR_CLIENT_ID&token=YOUR_ACCESS_TOKEN",
                      "Deauthorization URL copied to clipboard"
                    )}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-base">OAuth Redirect URI</h3>
                <p className="text-sm text-gray-500">
                  When setting up integrations, use this URL as your application's redirect URI.
                </p>
                <div className="flex items-center mt-1 p-2 bg-gray-100 rounded-md">
                  <code className="text-sm flex-1 overflow-x-auto">
                    https://app.tradeease.com/auth/callback
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 flex-shrink-0"
                    onClick={() => copyToClipboard(
                      "https://app.tradeease.com/auth/callback",
                      "OAuth Redirect URI copied to clipboard"
                    )}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-base">Webhook Endpoint</h3>
                <p className="text-sm text-gray-500">
                  Use this endpoint to receive real-time updates from Trade Ease.
                </p>
                <div className="flex items-center mt-1 p-2 bg-gray-100 rounded-md">
                  <code className="text-sm flex-1 overflow-x-auto">
                    https://api.tradeease.com/webhooks/YOUR_CLIENT_ID
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 flex-shrink-0"
                    onClick={() => copyToClipboard(
                      "https://api.tradeease.com/webhooks/YOUR_CLIENT_ID",
                      "Webhook Endpoint copied to clipboard"
                    )}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Replace placeholders like YOUR_CLIENT_ID and YOUR_REDIRECT_URI with your actual credentials when setting up integrations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsPageTemplate>
  );
}
