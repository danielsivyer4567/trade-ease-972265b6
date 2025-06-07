import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit3, Settings, X, Moon, Sun } from 'lucide-react';

interface TemplateEditorProps {
  editMode: boolean;
  showSidebar: boolean;
  selectedSection: string | null;
  selectedComponentType: string | null;
  components: any[];
  currentTitle: string;
  currentBgColor: string;
  currentTextColor: string;
  currentBorderStyle: string;
  currentBorderWidth: number;
  currentBorderRadius: number;
  currentPadding: number;
  currentMargin: number;
  componentTypes: any[];

  // Background image states
  backgroundImage: string | null;
  backgroundImageName: string;
  backgroundOpacity: number;
  imageSize: number;
  horizontalPosition: number;
  verticalPosition: number;
  fitMode: string;
  isDarkMode: boolean;
  
  // Functions
  toggleEditMode: () => void;
  toggleSidebar: () => void;
  clearSelection: () => void;
  selectComponentType: (type: string) => void;
  toggleDarkMode: () => void;

  // Background image functions
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetImagePosition: () => void;
  removeBackgroundImage: () => void;
  
  // Setters
  setCurrentTitle: (title: string) => void;
  setCurrentBgColor: (color: string) => void;
  setCurrentTextColor: (color: string) => void;
  setCurrentBorderStyle: (style: string) => void;
  setCurrentBorderWidth: (width: number) => void;
  setCurrentBorderRadius: (radius: number) => void;
  setCurrentPadding: (padding: number) => void;
  setCurrentMargin: (margin: number) => void;

  // Background image setters
  setBackgroundOpacity: (opacity: number) => void;
  setImageSize: (size: number) => void;
  setHorizontalPosition: (position: number) => void;
  setVerticalPosition: (position: number) => void;
  setFitMode: (mode: string) => void;
  setIsDarkMode: (isDark: boolean) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  editMode,
  showSidebar,
  selectedSection,
  selectedComponentType,
  components,
  currentTitle,
  currentBgColor,
  currentTextColor,
  currentBorderStyle,
  currentBorderWidth,
  currentBorderRadius,
  currentPadding,
  currentMargin,
  componentTypes,
  backgroundImage,
  backgroundImageName,
  backgroundOpacity,
  imageSize,
  horizontalPosition,
  verticalPosition,
  fitMode,
  isDarkMode,
  toggleEditMode,
  toggleSidebar,
  clearSelection,
  selectComponentType,
  toggleDarkMode,
  handleImageUpload,
  resetImagePosition,
  removeBackgroundImage,
  setCurrentTitle,
  setCurrentBgColor,
  setCurrentTextColor,
  setCurrentBorderStyle,
  setCurrentBorderWidth,
  setCurrentBorderRadius,
  setCurrentPadding,
  setCurrentMargin,
  setBackgroundOpacity,
  setImageSize,
  setHorizontalPosition,
  setVerticalPosition,
  setFitMode,
  setIsDarkMode
}) => {
  return (
    <>
      {/* Edit Mode Controls */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={toggleDarkMode}
          className="bg-gray-700 hover:bg-gray-600 text-white gap-2"
          size="sm"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDarkMode ? 'Light' : 'Dark'}
        </Button>
        <Button
          onClick={toggleEditMode}
          className={`${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white gap-2`}
          size="sm"
        >
          <Edit3 className="w-4 h-4" />
          {editMode ? '✓ Exit Edit' : '✏️ Edit Mode'}
        </Button>
        <Button
          onClick={toggleSidebar}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          size="sm"
        >
          <Settings className="w-4 h-4" />
          ⚙️ Customize
        </Button>
      </div>

      {/* Customization Sidebar */}
      {showSidebar && (
        <div className="fixed top-0 right-0 w-80 h-full bg-slate-800 text-white z-50 overflow-y-auto">
          <div className="p-5 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">⚙️ Template Builder</h3>
              <Button
                onClick={toggleSidebar}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleEditMode}
                className={`${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 text-xs`}
                size="sm"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                {editMode ? '✓ Exit Edit' : '✏️ Edit Mode'}
              </Button>
              <Button
                onClick={toggleDarkMode}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 text-xs"
                size="sm"
              >
                {isDarkMode ? <Sun className="w-3 h-3 mr-1" /> : <Moon className="w-3 h-3 mr-1" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>

          <div className="p-5">
            {/* Components List */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">📦 Available Components</h4>
              <div className="space-y-1">
                {componentTypes.map(component => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={component.id}
                      className={`p-3 rounded cursor-pointer text-sm transition-colors ${
                        selectedComponentType === component.id
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      onClick={() => selectComponentType(component.id)}
                    >
                      <Icon className="w-4 h-4 inline mr-2" />
                      {component.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Background Image Controls - Always Visible */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">📁 Background Image</h4>
              <div className="bg-slate-700 p-4 rounded">
                <div className="space-y-4">
                  {/* Upload Section */}
                  <div>
                    <label className="block text-xs text-slate-300 mb-2">Upload Background Image:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="background-upload"
                      />
                      <label
                        htmlFor="background-upload"
                        className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs text-slate-300 cursor-pointer hover:bg-slate-750 transition-colors"
                      >
                        {backgroundImageName || 'Choose file...'}
                      </label>
                      {backgroundImage && (
                        <Button
                          onClick={removeBackgroundImage}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs h-8"
                          size="sm"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Opacity Control */}
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Background Opacity: {backgroundOpacity}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={backgroundOpacity}
                      onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Image Controls - Show only when image is uploaded */}
                  {backgroundImage && (
                    <>
                      <div className="border-t border-slate-600 pt-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Image Size: {imageSize}%</label>
                            <input
                              type="range"
                              min="10"
                              max="200"
                              value={imageSize}
                              onChange={(e) => setImageSize(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Horizontal: {horizontalPosition}%</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={horizontalPosition}
                              onChange={(e) => setHorizontalPosition(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Vertical: {verticalPosition}%</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={verticalPosition}
                              onChange={(e) => setVerticalPosition(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Fit Mode:</label>
                            <select
                              value={fitMode}
                              onChange={(e) => setFitMode(e.target.value)}
                              className="w-full p-1 bg-slate-800 border border-slate-600 rounded text-white text-xs h-8"
                            >
                              <option value="cover">Cover</option>
                              <option value="contain">Contain</option>
                              <option value="fill">Fill</option>
                              <option value="none">Original Size</option>
                              <option value="repeat">Repeat</option>
                            </select>
                          </div>
                        </div>

                        <Button
                          onClick={resetImagePosition}
                          className="w-full bg-slate-600 hover:bg-slate-500 text-white text-xs h-8 mt-3"
                          size="sm"
                        >
                          Reset Position
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">🎨 Properties</h4>
              <div className="bg-slate-700 p-4 rounded max-h-64 overflow-y-auto">
                {selectedSection ? (
                  <div className="space-y-4">
                    <div className="border-b border-slate-600 pb-3">
                      <h5 className="text-xs font-semibold text-slate-400 mb-2">GENERAL</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Section Title:</label>
                          <Input
                            className="bg-slate-800 border-slate-600 text-white text-xs h-8"
                            value={currentTitle}
                            onChange={(e) => setCurrentTitle(e.target.value)}
                            placeholder="Enter title"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-slate-600 pb-3">
                      <h5 className="text-xs font-semibold text-slate-400 mb-2">COLORS</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Background:</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={currentBgColor}
                              onChange={(e) => setCurrentBgColor(e.target.value)}
                              className="w-8 h-8 border border-slate-600 rounded"
                            />
                            <Input
                              className="bg-slate-800 border-slate-600 text-white text-xs h-8 flex-1"
                              value={currentBgColor}
                              onChange={(e) => setCurrentBgColor(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Text Color:</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={currentTextColor}
                              onChange={(e) => setCurrentTextColor(e.target.value)}
                              className="w-8 h-8 border border-slate-600 rounded"
                            />
                            <Input
                              className="bg-slate-800 border-slate-600 text-white text-xs h-8 flex-1"
                              value={currentTextColor}
                              onChange={(e) => setCurrentTextColor(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-slate-600 pb-3">
                      <h5 className="text-xs font-semibold text-slate-400 mb-2">BORDER</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Style:</label>
                          <select 
                            value={currentBorderStyle}
                            onChange={(e) => setCurrentBorderStyle(e.target.value)}
                            className="w-full p-1 bg-slate-800 border border-slate-600 rounded text-white text-xs h-8"
                          >
                            <option value="none">None</option>
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                            <option value="double">Double</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Width: {currentBorderWidth}px</label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={currentBorderWidth}
                            onChange={(e) => setCurrentBorderWidth(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Radius: {currentBorderRadius}px</label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={currentBorderRadius}
                            onChange={(e) => setCurrentBorderRadius(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pb-3">
                      <h5 className="text-xs font-semibold text-slate-400 mb-2">SPACING</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Padding: {currentPadding}px</label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={currentPadding}
                            onChange={(e) => setCurrentPadding(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Margin: {currentMargin}px</label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={currentMargin}
                            onChange={(e) => setCurrentMargin(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pb-3">
                      <h5 className="text-xs font-semibold text-slate-400 mb-2">ACTIONS</h5>
                      <div className="space-y-2">
                        <Button
                          onClick={() => clearSelection()}
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs h-8"
                          size="sm"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center">
                    Select a component to edit its properties
                  </p>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-600">
              {components.length} component{components.length !== 1 ? 's' : ''} total
              {editMode && <div className="text-green-400 mt-1">🎨 Edit Mode Active</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateEditor; 