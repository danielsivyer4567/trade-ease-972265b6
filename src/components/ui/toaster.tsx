
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { SIDEBAR_CONSTANTS } from "@/components/ui/sidebar/constants"

export function Toaster() {
  const { toasts } = useToast()
  const isMobile = useIsMobile()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white border shadow-lg">
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport 
        className={`${isMobile ? 'bottom-0 p-2 w-full' : 'bottom-0 right-0 p-4'} top-auto flex-col md:max-w-[420px] fixed`} 
        style={{ zIndex: SIDEBAR_CONSTANTS.NOTIFICATIONS_Z_INDEX * 2 }} 
      />
    </ToastProvider>
  )
}
