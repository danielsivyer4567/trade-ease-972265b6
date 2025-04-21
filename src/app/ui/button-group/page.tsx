import { Metadata } from "next"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"

export const metadata: Metadata = {
  title: "Button Group",
  description: "Button group component showcase",
}

export default function ButtonGroupDemo() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <h1 className="text-2xl font-bold mb-6">Button Group Component</h1>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Horizontal Button Groups</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Default Variant</span>
            <ButtonGroup>
              <ButtonGroupItem>Button 1</ButtonGroupItem>
              <ButtonGroupItem>Button 2</ButtonGroupItem>
              <ButtonGroupItem>Button 3</ButtonGroupItem>
            </ButtonGroup>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Secondary Variant</span>
            <ButtonGroup variant="secondary">
              <ButtonGroupItem>Button 1</ButtonGroupItem>
              <ButtonGroupItem>Button 2</ButtonGroupItem>
              <ButtonGroupItem>Button 3</ButtonGroupItem>
            </ButtonGroup>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Outline Variant</span>
            <ButtonGroup variant="outline">
              <ButtonGroupItem>Button 1</ButtonGroupItem>
              <ButtonGroupItem>Button 2</ButtonGroupItem>
              <ButtonGroupItem>Button 3</ButtonGroupItem>
            </ButtonGroup>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Different Sizes</span>
            <div className="space-y-2">
              <ButtonGroup size="sm">
                <ButtonGroupItem>Small</ButtonGroupItem>
                <ButtonGroupItem>Buttons</ButtonGroupItem>
              </ButtonGroup>
              
              <ButtonGroup>
                <ButtonGroupItem>Default</ButtonGroupItem>
                <ButtonGroupItem>Buttons</ButtonGroupItem>
              </ButtonGroup>
              
              <ButtonGroup size="lg">
                <ButtonGroupItem>Large</ButtonGroupItem>
                <ButtonGroupItem>Buttons</ButtonGroupItem>
              </ButtonGroup>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Mixed Individual Variants</span>
            <ButtonGroup>
              <ButtonGroupItem>Default</ButtonGroupItem>
              <ButtonGroupItem variant="secondary">Secondary</ButtonGroupItem>
              <ButtonGroupItem variant="destructive">Destructive</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Vertical Button Groups</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Default Variant</span>
              <ButtonGroup vertical>
                <ButtonGroupItem>Button 1</ButtonGroupItem>
                <ButtonGroupItem>Button 2</ButtonGroupItem>
                <ButtonGroupItem>Button 3</ButtonGroupItem>
              </ButtonGroup>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Secondary Variant</span>
              <ButtonGroup variant="secondary" vertical>
                <ButtonGroupItem>Button 1</ButtonGroupItem>
                <ButtonGroupItem>Button 2</ButtonGroupItem>
                <ButtonGroupItem>Button 3</ButtonGroupItem>
              </ButtonGroup>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Outline Variant</span>
              <ButtonGroup variant="outline" vertical>
                <ButtonGroupItem>Button 1</ButtonGroupItem>
                <ButtonGroupItem>Button 2</ButtonGroupItem>
                <ButtonGroupItem>Button 3</ButtonGroupItem>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 