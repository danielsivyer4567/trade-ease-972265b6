
import React, { useState, useEffect, useCallback } from 'react';
import { TagData, Point, Notification as AppNotification, DrawingState, Attachment } from './types';
import TaggingDock from './components/TaggingDock';
import TagPopup from './components/TagPopup';
import FullPageDrawingOverlay from './components/FullPageDrawingOverlay';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import * as TagService from './services/tagService';
import { MOCK_BUSINESS_LOGO_URL, CURRENT_USER_ID, CURRENT_USER_NAME, AVAILABLE_STAFF, DEFAULT_DRAWING_STATE } from './constants';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Tag as TagIconLucide, Image as ImageIconLucide, Mic as MicIconLucide, Brush as BrushIconLucide } from 'lucide-react';


const DummyPageContent: React.FC = () => (
  <div className="container mx-auto p-8 space-y-8 relative">
    <header className="bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Interactive Document Title
      </h1>
      <p className="text-slate-600 mt-3 text-lg">
        This is an example page where users can collaborate by dropping tags, making annotations, and leaving comments.
        Try activating "Tag Drop Mode" from the side panel! Click on existing tag markers to view details.
      </p>
    </header>

    <section id="section1" className="bg-white shadow-xl rounded-xl p-8 min-h-[300px]">
      <h2 className="text-3xl font-semibold text-slate-800 mb-4 border-b-2 border-indigo-500 pb-2">Section One: Key Information</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        <img src="https://picsum.photos/seed/pageimg1/600/200" alt="Placeholder" className="my-4 rounded-lg shadow-md" />
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
      <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
        Important Action
      </button>
    </section>

    <section id="section2" className="bg-white shadow-xl rounded-xl p-8 min-h-[400px]">
      <h2 className="text-3xl font-semibold text-slate-800 mb-4 border-b-2 border-teal-500 pb-2">Section Two: Analysis &amp; Data</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <p className="text-slate-700 leading-relaxed">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.
          Vestibulum আপনা মাংসে হরিণা বৈরী; কি করবে তাতে Serengeti plains.
        </p>
        <img src="https://picsum.photos/seed/pageimg2/400/250" alt="Data visual" className="rounded-lg shadow-md object-cover w-full h-full" />
      </div>
       <div className="mt-6 p-4 bg-teal-50 border-l-4 border-teal-500 rounded-r-lg">
        <p className="text-teal-700 text-sm">
          <strong className="font-semibold">Note:</strong> Data represented here is for illustrative purposes only. Actual figures may vary.
          Please consult the official documentation for precise information.
        </p>
      </div>
    </section>
    
    <footer className="text-center text-sm text-slate-500 py-8 mt-8 border-t border-slate-200">
      &copy; {new Date().getFullYear()} Tag Drop Pro. All rights reserved.
    </footer>
  </div>
);

const AllActivityPage: React.FC = () => {
    const { notifications } = useNotifications();
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">All Activity</h1>
                    <Link to="/" className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                        &larr; Back to Main
                    </Link>
                </div>
                {notifications.length === 0 ? (
                    <div className="text-center py-10 bg-white shadow-md rounded-lg">
                        <TagIconLucide className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No activity yet. Start collaborating!</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {notifications.map(n => (
                            <li key={n.id} className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-slate-700">{n.title}</p>
                                        <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                                    </div>
                                    {!n.read && <span className="mt-1 h-2.5 w-2.5 bg-blue-500 rounded-full" title="Unread"></span>}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">{new Date(n.timestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};


const AppContent: React.FC = () => {
  const [tags, setTags] = useState<TagData[]>([]);
  const { addNotification, markAsRead: globalMarkNotificationAsRead, notifications: globalNotifications } = useNotifications();

  const [showTagPopup, setShowTagPopup] = useState(false);
  const [tagPopupCoords, setTagPopupCoords] = useState<Point>({ x: 0, y: 0 });
  const [currentEditingTag, setCurrentEditingTag] = useState<TagData | null>(null);

  const [showFullPageDrawing, setShowFullPageDrawing] = useState(false);
  const [fullPageDrawingInitialState, setFullPageDrawingInitialState] = useState<Partial<DrawingState>>({});
  const [fullPageDrawingResult, setFullPageDrawingResult] = useState<string | null>(null);
  
  const [hoveredTagDrawing, setHoveredTagDrawing] = useState<{ url: string; coords: Point } | null>(null);


  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await TagService.getAllTags();
      setTags(fetchedTags);
    };
    fetchTags();
  }, []);

  const handlePopupForTagAction = useCallback((action: { type: 'view', tag: TagData } | { type: 'new', coords: Point }) => {
    if (action.type === 'view') {
      setCurrentEditingTag(action.tag);
      setTagPopupCoords(action.tag.coords);
      globalNotifications.filter(n => n.tagId === action.tag.id && !n.read).forEach(n => globalMarkNotificationAsRead(n.id));
    } else if (action.type === 'new') {
      setCurrentEditingTag(null);
      setTagPopupCoords(action.coords);
    }
    setShowTagPopup(true);
    setFullPageDrawingResult(null); 
  }, [globalNotifications, globalMarkNotificationAsRead]);

  const handleSaveTag = async (tagData: TagData) => { // This now handles create or full update if creator edits
    if (currentEditingTag && currentEditingTag.id === tagData.id) { // Updating existing tag
       // For full updates (e.g., creator changes attachments, main drawing), we might need a different service
       // For now, let's assume onSave from popup is for initial creation or specific updates by creator.
       // The new comment flow is handled by handleUpdateComment.
       // This simple update just re-sets the tag in local state.
       // A more robust backend would handle partial updates.
      const updatedTag = { ...currentEditingTag, ...tagData }; // Simplified local update
      setTags(prevTags => prevTags.map(t => t.id === updatedTag.id ? updatedTag : t));
      setCurrentEditingTag(updatedTag); // Keep popup updated if it's still open
      addNotification({
        type: 'generic', title: 'Tag Details Updated',
        message: `Details for tag by ${updatedTag.creatorName} were updated.`, tagId: updatedTag.id,
      });
    } else { // Creating new tag
      const newSavedTag = await TagService.createTag(tagData); // Assuming createTag handles the structure
      setTags(prevTags => [...prevTags, newSavedTag]);
      newSavedTag.taggedStaffIds.forEach(staffId => {
        if (staffId !== CURRENT_USER_ID) {
          addNotification({
            type: 'mention', title: `New Tag from ${newSavedTag.creatorName}`,
            message: `${newSavedTag.creatorName} tagged you: "${newSavedTag.comment.substring(0, 50)}..."`,
            tagId: newSavedTag.id
          });
        }
      });
    }
    setShowTagPopup(false);
  };
  
  // This handles adding a new message to the conversation (which becomes the main comment)
  const handleUpdateComment = async (tagId: string, newCommentText: string): Promise<TagData | null> => {
    const updatedTag = await TagService.updateTagWithNewComment(tagId, newCommentText, CURRENT_USER_ID, CURRENT_USER_NAME);
    if (updatedTag) {
      setTags(prevTags => prevTags.map(t => t.id === updatedTag.id ? updatedTag : t));
      setCurrentEditingTag(updatedTag); // Important to update the tag in the popup
      addNotification({
        type: 'reply', title: `New Message by You`,
        message: `You added to conversation on tag: "${updatedTag.comment.substring(0,30)}..."`,
        tagId: updatedTag.id,
      });
      // Notify other tagged staff about the new message
      updatedTag.taggedStaffIds.forEach(staffId => {
        if (staffId !== CURRENT_USER_ID && staffId !== updatedTag.currentCommentAuthorId) { // Don't notify self or author of this new message
           addNotification({
            type: 'reply', title: `New Message on Tag by ${CURRENT_USER_NAME}`,
            message: `${CURRENT_USER_NAME} commented: "${newCommentText.substring(0,50)}..." on a tag you're part of.`,
            tagId: updatedTag.id
          });
        }
      });
    }
    return updatedTag;
  };
  
  const handleStartFullPageDrawingFromPopup = (initialState: Partial<DrawingState>, currentInlineData?: string) => {
    setFullPageDrawingInitialState(initialState);
    setShowFullPageDrawing(true);
    setShowTagPopup(false);
    localStorage.setItem('tagPopupOpenBeforeFullDraw', 'true');
  };

  const handleSaveFullPageDrawing = (dataUrl: string) => {
    setFullPageDrawingResult(dataUrl);
    setShowFullPageDrawing(false);
    if (localStorage.getItem('tagPopupOpenBeforeFullDraw') === 'true') {
        setShowTagPopup(true);
        localStorage.removeItem('tagPopupOpenBeforeFullDraw');
    }
  };
  
  const handleCloseFullPageDrawing = () => {
    setShowFullPageDrawing(false);
     if (localStorage.getItem('tagPopupOpenBeforeFullDraw') === 'true') {
        setShowTagPopup(true);
        localStorage.removeItem('tagPopupOpenBeforeFullDraw');
    }
  };

  const getTagMarkerIcon = (tag: TagData): React.ReactNode => {
    // Prioritize drawingDataUrl for the marker itself if it exists
    if (tag.drawingDataUrl) {
        return <img src={tag.drawingDataUrl} alt="Main drawing annotation" className="w-full h-full object-contain p-0.5" />;
    }
    // Fallback to attachment previews or default icon
    if (tag.attachments && tag.attachments.length > 0) {
        const firstAttachment = tag.attachments[0];
        if (firstAttachment.type === 'image' && firstAttachment.previewUrl) {
            return <img src={firstAttachment.previewUrl} alt="Image marker" className="w-full h-full object-cover" />;
        }
        if (firstAttachment.type === 'drawing' && firstAttachment.previewUrl) { // Secondary drawing attachment
            return <img src={firstAttachment.previewUrl} alt="Drawing attachment marker" className="w-full h-full object-cover" />;
        }
        if (firstAttachment.type === 'audio') {
            return <MicIconLucide className="w-4 h-4 text-white" />;
        }
    }
    return <TagIconLucide className="w-4 h-4 text-white" />;
  };

  const renderTagMarkers = () => {
    return tags.map(tag => (
      <div
        key={tag.id}
        className="tag-marker fixed z-[45] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 pointer-events-auto group hover:z-[46]"
        style={{ left: `${tag.coords.x}px`, top: `${tag.coords.y}px` }}
        onClick={(e) => { e.stopPropagation(); handlePopupForTagAction({ type: 'view', tag }); }}
        onMouseEnter={() => { if (tag.drawingDataUrl) setHoveredTagDrawing({ url: tag.drawingDataUrl, coords: tag.coords }); }}
        onMouseLeave={() => setHoveredTagDrawing(null)}
        title={`Tag by ${tag.creatorName}: ${tag.comment.substring(0,30)}...`}
      >
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:border-blue-400 transition-transform overflow-hidden">
            {getTagMarkerIcon(tag)}
        </div>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
          {tag.comment.substring(0,50) || "View Tag Details"}
          {tag.comment.length > 50 ? "..." : ""}
        </span>
      </div>
    ));
  };

  const renderHoveredDrawing = () => {
    if (!hoveredTagDrawing) return null;
    // Position the drawing preview slightly offset from the marker
    const previewX = hoveredTagDrawing.coords.x + 20; 
    const previewY = hoveredTagDrawing.coords.y - 100; // Position above the marker typically

    return (
        <div 
            className="fixed z-[47] p-1 bg-white border border-gray-300 shadow-xl rounded-md pointer-events-none transition-opacity duration-150 ease-in-out"
            style={{ 
                left: `${previewX}px`, 
                top: `${Math.max(10, previewY)}px`, // Ensure it doesn't go off-screen top
                maxWidth: '300px', 
                maxHeight: '250px' 
            }}
        >
            <img 
                src={hoveredTagDrawing.url} 
                alt="Drawing Preview" 
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '240px' }} // ensure img respects padding
            />
        </div>
    );
  };


  return (
    <div className="min-h-screen flex flex-col relative bg-gray-100">
      <main className="flex-grow">
         <Routes>
            <Route path="/" element={<DummyPageContent />} />
            <Route path="/all-activity" element={<AllActivityPage />} />
        </Routes>
      </main>
      
      {renderTagMarkers()}
      {renderHoveredDrawing()}

      <TaggingDock
        initialTags={tags}
        onNewTagCreated={handleSaveTag} // This is for brand new tags
        onTagUpdated={handleSaveTag}   // This is for full updates by creator
        onTagReplied={handleUpdateComment} // This is for adding to conversation thread
        onOpenPopupForTagAction={handlePopupForTagAction}
      />

      {showTagPopup && (
        <TagPopup
          key={currentEditingTag ? currentEditingTag.id : 'new-tag-popup'}
          isOpen={showTagPopup}
          onClose={() => { setShowTagPopup(false); setCurrentEditingTag(null); }}
          onSave={handleSaveTag} // For new tags or creator edits
          onUpdateComment={handleUpdateComment} // For adding new messages to conversation
          existingTag={currentEditingTag}
          coords={tagPopupCoords}
          availableStaff={AVAILABLE_STAFF}
          currentUserId={CURRENT_USER_ID}
          currentUserName={CURRENT_USER_NAME}
          onStartFullPageDrawing={handleStartFullPageDrawingFromPopup}
          fullPageDrawingResult={fullPageDrawingResult}
          onClearFullPageDrawingResult={() => setFullPageDrawingResult(null)}
        />
      )}

       <FullPageDrawingOverlay
        isOpen={showFullPageDrawing}
        onClose={handleCloseFullPageDrawing}
        onSave={handleSaveFullPageDrawing}
        initialDrawingState={fullPageDrawingInitialState}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
        <AppContent />
    </NotificationProvider>
  );
};

export default App;
