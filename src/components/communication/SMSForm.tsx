
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client'

export function SMSForm() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('twilio-integration', {
        body: { to: phoneNumber, body: message }
      })

      if (error) throw error

      toast({
        title: "Message sent successfully",
        description: "Your SMS has been sent.",
      })

      // Clear form
      setPhoneNumber('')
      setMessage('')
    } catch (error) {
      console.error('Error sending SMS:', error)
      toast({
        title: "Error sending message",
        description: "There was a problem sending your SMS. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send SMS'}
      </Button>
    </form>
  )
}
