
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TagData, StaffMember, Attachment, DrawingState, UploadedFile, Point, CommentHistoryItem, cn } from '../types';
import { CURRENT_USER_ID, CURRENT_USER_NAME, AVAILABLE_STAFF, DEFAULT_DRAWING_STATE, MAX_COMMENT_LENGTH, DRAWING_COLORS, DRAWING_LINE_WIDTHS } from '../constants';
import DrawingCanvas, { DrawingToolbar } from './DrawingCanvas';
import useAudioRecorder from '../hooks/useAudioRecorder';
import { uploadFileToSupabase } from '../services/tagService';
import { X, Tag as TagIcon, Paperclip, Image as ImageIcon, Mic, Brush, Trash2, Send, ChevronDown, ChevronUp, UserPlus, AlertCircle, Save, Edit3, MessageCircle, Clock } from 'lucide-react';

const toast = {
  success: (message: string) => console.log(`Toast Success: ${message}`),
  error: (message: string) => console.error(`Toast Error: ${message}`),
};

interface TagPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagData: TagData) => void; 
  onUpdateComment: (tagId: string, newCommentText: string) => Promise<TagData | null>; 
  existingTag?: TagData | null;
  coords: Point;
  availableStaff?: StaffMember[];
  currentUserId?: string;
  currentUserName?: string;
  onStartFullPageDrawing: (initialState: Partial<DrawingState>, currentDrawingDataUrl?: string) => void;
  fullPageDrawingResult?: string | null;
  onClearFullPageDrawingResult: () => void;
}

const TagPopup: React.FC<TagPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdateComment,
  existingTag,
  coords,
  availableStaff = AVAILABLE_STAFF,
  currentUserId = CURRENT_USER_ID,
  currentUserName = CURRENT_USER_NAME,
  onStartFullPageDrawing,
  fullPageDrawingResult,
  onClearFullPageDrawingResult,
}) => {
  const [comment, setComment] = useState(''); 
  const [nextMessageText, setNextMessageText] = useState(''); 
  const [selectedStaff, setSelectedStaff] = useState<StaffMember[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const [drawingState, setDrawingState] = useState<DrawingState>(DEFAULT_DRAWING_STATE);
  const [showDrawingPad, setShowDrawingPad] = useState(false);
  const [mainAnnotationUrl, setMainAnnotationUrl] = useState<string | null>(null); 

  const [isLoading, setIsLoading] = useState(false);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const staffDropdownRef = useRef<HTMLDivElement>(null);
  const staffInputRef = useRef<HTMLInputElement>(null);

  const [popupPosition, setPopupPosition] = useState<Point>(coords);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef<Point>({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  const { resetRecording: resetAudioRecorder, ...audioRecorderState } = useAudioRecorder();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isViewMode = !!existingTag;

  const resetForm = useCallback(() => {
    setComment('');
    setNextMessageText('');
    setSelectedStaff([]);
    setUploadedFiles([]);
    setShowDrawingPad(false);
    setMainAnnotationUrl(null);
    setDrawingState(DEFAULT_DRAWING_STATE);
    resetAudioRecorder();
    setStaffSearchTerm('');
    setShowStaffDropdown(false);
  }, [resetAudioRecorder]);

  useEffect(() => {
    if (isOpen) {
        setPopupPosition(coords);
        if (existingTag) {
            setComment(existingTag.comment); 
            setSelectedStaff(availableStaff.filter(s => existingTag.taggedStaffIds.includes(s.id)));
            setMainAnnotationUrl(existingTag.drawingDataUrl || null);
            setUploadedFiles(existingTag.attachments.map(att => ({
                id: att.id, file: new File([], att.fileName), previewUrl: att.previewUrl, type: att.type, remoteUrl: att.url,
            })));
            setNextMessageText(''); 
        } else {
            resetForm();
        }
    }
  }, [isOpen, existingTag, coords, resetForm, availableStaff]);

  const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    try {
        const arr = dataurl.split(','); if (arr.length < 2) return null;
        const mimeMatch = arr[0].match(/:(.*?);/); if (!mimeMatch || mimeMatch.length < 2) return null;
        const mime = mimeMatch[1]; const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
    } catch (e) { console.error("Error converting data URL to file:", e); toast.error("Could not process drawing data."); return null; }
  };
  
  useEffect(() => {
    if (fullPageDrawingResult) {
      setMainAnnotationUrl(fullPageDrawingResult);
      const file = dataURLtoFile(fullPageDrawingResult, `fullpage_drawing_${Date.now()}.png`);
      if (file) {
          const newAttachment: UploadedFile = {
            id: 'temp_fullpage_drawing', // Use a consistent ID for replacement
            file: file,
            previewUrl: fullPageDrawingResult,
            type: 'drawing',
          };
          setUploadedFiles(prev => [...prev.filter(f => f.id !== 'temp_fullpage_drawing' && f.id !== 'inline_drawing_annotation'), newAttachment]);
      }
      onClearFullPageDrawingResult();
      setShowDrawingPad(false);
    }
  }, [fullPageDrawingResult, onClearFullPageDrawingResult]);


  const handleMouseDownDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupRef.current) return;
    if (!(e.target as HTMLElement).closest('.popup-drag-handle')) return;
    setIsDragging(true);
    const rect = popupRef.current.getBoundingClientRect();
    dragStartOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, };
    e.preventDefault();
  };
  const handleMouseMoveDrag = useCallback((e: MouseEvent) => {
    if (!isDragging || !popupRef.current) return;
    let newX = e.clientX - dragStartOffset.current.x;
    let newY = e.clientY - dragStartOffset.current.y;
    const margin = 10;
    newX = Math.max(margin, Math.min(newX, window.innerWidth - popupRef.current.offsetWidth - margin));
    newY = Math.max(margin, Math.min(newY, window.innerHeight - popupRef.current.offsetHeight - margin));
    setPopupPosition({ x: newX, y: newY });
  }, [isDragging]);
  const handleMouseUpDrag = useCallback(() => { setIsDragging(false); }, []);
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveDrag);
      document.addEventListener('mouseup', handleMouseUpDrag);
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMoveDrag);
      document.removeEventListener('mouseup', handleMouseUpDrag);
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveDrag);
      document.removeEventListener('mouseup', handleMouseUpDrag);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMoveDrag, handleMouseUpDrag]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile: UploadedFile = {
          id: `file_${Date.now()}`, file,
          previewUrl: file.type.startsWith('image/') ? reader.result as string : undefined,
          type: file.type.startsWith('image/') ? 'image' : 'audio', 
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      if (file.type.startsWith('image/') || file.type.startsWith('audio/')) reader.readAsDataURL(file);
      else { 
         const newFile: UploadedFile = { id: `file_${Date.now()}`, file, type: 'image' };
         setUploadedFiles(prev => [...prev, newFile]);
      }
    }
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    const removedFile = uploadedFiles.find(f => f.id === id);
    if (removedFile && removedFile.type === 'drawing' && removedFile.previewUrl === mainAnnotationUrl) {
        setMainAnnotationUrl(null);
    }
  };
  
  const handleInlineDrawEnd = (dataUrl: string) => {
    setMainAnnotationUrl(dataUrl); 
    const file = dataURLtoFile(dataUrl, 'inline_annotation.png');
    if (file) {
        const drawingFile: UploadedFile = {
        id: 'inline_drawing_annotation', file: file,
        previewUrl: dataUrl, type: 'drawing',
        };
        setUploadedFiles(prev => {
            const existing = prev.find(f => f.id === 'inline_drawing_annotation');
            if (existing) return prev.map(f => f.id === 'inline_drawing_annotation' ? drawingFile : f);
            return [...prev.filter(f => f.id !== 'temp_fullpage_drawing'), drawingFile]; // remove full page if inline is added
        });
    }
  };
  
  const handleToggleDrawingPad = () => setShowDrawingPad(!showDrawingPad);
  const handleStartFullPageDraw = () => onStartFullPageDrawing(drawingState, mainAnnotationUrl || undefined);

  const handleSaveTagData = async () => { 
    if (!isViewMode && selectedStaff.length === 0) {
      toast.error('Please tag at least one staff member.'); return;
    }
    if (!isViewMode && !comment.trim() && uploadedFiles.length === 0 && !mainAnnotationUrl && !audioRecorderState.audioBlob) {
        toast.error('Please add a comment or an attachment for a new tag.'); return;
    }

    setIsLoading(true);
    const finalAttachments: Attachment[] = [];

    for (const uploadedFile of uploadedFiles) {
      // Skip if it's the mainAnnotationUrl and we save that separately, unless it's not present as a distinct 'file' (e.g., initial draw was main)
      if (uploadedFile.type === 'drawing' && uploadedFile.previewUrl === mainAnnotationUrl && uploadedFile.id === 'inline_drawing_annotation') {
          // This is handled by mainAnnotationUrl, but ensure it gets uploaded if it's also in files
          // Let it pass through to upload if it's distinct
      }
      
      if (uploadedFile.remoteUrl && existingTag?.attachments.find(att => att.id === uploadedFile.id && att.url === uploadedFile.remoteUrl)) {
        finalAttachments.push({
            id: uploadedFile.id, type: uploadedFile.type, url: uploadedFile.remoteUrl,
            fileName: uploadedFile.file.name, previewUrl: uploadedFile.previewUrl,
        });
        continue;
      }
      let fileToUpload = uploadedFile.file;
      let fileName = uploadedFile.file.name;
      if (!fileToUpload && uploadedFile.type === 'drawing' && uploadedFile.previewUrl) { // Case for drawings that are only data URLs
          const drawingFileObject = dataURLtoFile(uploadedFile.previewUrl, `${uploadedFile.id || 'drawing'}.png`);
          if (drawingFileObject) { fileToUpload = drawingFileObject; fileName = drawingFileObject.name; }
          else { console.error("Could not convert drawing dataURL to file for upload"); continue; }
      }
       if (!fileToUpload) { // If still no file, skip (e.g. placeholder)
            console.warn("Skipping upload for file without actual data:", uploadedFile);
            continue;
        }

      try {
        const folder = `tags/${currentUserId}/${Date.now()}`;
        const url = await uploadFileToSupabase(fileToUpload, folder, fileName);
        finalAttachments.push({
          id: uploadedFile.id, type: uploadedFile.type, url, fileName, previewUrl: uploadedFile.previewUrl,
        });
      } catch (error) { toast.error(`Failed to upload ${fileName}.`); setIsLoading(false); return; }
    }
    
    if (audioRecorderState.audioBlob && !uploadedFiles.some(f => f.id === 'recorded_audio')) {
        try {
            const audioFileName = `voice_note_${Date.now()}.webm`;
            const audioFile = new File([audioRecorderState.audioBlob], audioFileName, {type: audioRecorderState.audioBlob.type});
            const folder = `tags/${currentUserId}/${Date.now()}/audio`;
            const url = await uploadFileToSupabase(audioFile, folder, audioFileName);
            finalAttachments.push({ id: `audio_${Date.now()}`, type: 'audio', url, fileName: audioFileName });
        } catch (error) { toast.error('Failed to upload voice note.'); setIsLoading(false); return; }
    }

    const tagPayload: TagData = {
      id: existingTag?.id || `tag_${Date.now()}`,
      creatorId: existingTag?.creatorId || currentUserId,
      creatorName: existingTag?.creatorName || currentUserName,
      pageUrl: existingTag?.pageUrl || window.location.href,
      coords: existingTag?.coords || coords,
      comment: comment, 
      currentCommentAuthorId: existingTag?.currentCommentAuthorId || currentUserId,
      currentCommentAuthorName: existingTag?.currentCommentAuthorName || currentUserName,
      currentCommentTimestamp: existingTag?.currentCommentTimestamp || Date.now(),
      taggedStaffIds: selectedStaff.map(s => s.id),
      attachments: finalAttachments,
      drawingDataUrl: mainAnnotationUrl, 
      timestamp: existingTag?.timestamp || Date.now(),
      commentHistory: existingTag?.commentHistory || [],
    };

    onSave(tagPayload); 
    setIsLoading(false);
    if (!existingTag) resetForm();
    onClose();
  };

  const handlePostNewMainComment = async () => {
    if (!nextMessageText.trim() || !existingTag) return;
    setIsLoading(true);
    const updatedTag = await onUpdateComment(existingTag.id, nextMessageText);
    if (updatedTag) {
      setComment(updatedTag.comment); 
      setNextMessageText(''); 
    } else {
      toast.error('Failed to post message.');
    }
    setIsLoading(false);
  };
  
  const filteredStaff = availableStaff.filter(staff =>
    staff.name.toLowerCase().includes(staffSearchTerm.toLowerCase()) &&
    !selectedStaff.some(s => s.id === staff.id)
  );
  const handleStaffSelect = (staff: StaffMember) => {
    if (!selectedStaff.some(s => s.id === staff.id)) setSelectedStaff(prev => [...prev, staff]);
    setStaffSearchTerm(''); setShowStaffDropdown(false); staffInputRef.current?.focus();
  };
  const handleStaffRemove = (staffId: string) => setSelectedStaff(prev => prev.filter(s => s.id !== staffId));
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (staffDropdownRef.current && !staffDropdownRef.current.contains(event.target as Node) &&
          staffInputRef.current && !staffInputRef.current.contains(event.target as Node)) {
        setShowStaffDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleAudioRecordToggle = async () => {
    if (audioRecorderState.isRecording) {
      const blob = await audioRecorderState.stopRecording();
      if (blob) {
         const audioFile: UploadedFile = {
            id: 'recorded_audio', file: new File([blob], `recorded_audio_${Date.now()}.webm`, {type: blob.type}),
            type: 'audio', previewUrl: audioRecorderState.audioUrl || undefined
         };
         setUploadedFiles(prev => [...prev.filter(f => f.id !== 'recorded_audio'), audioFile]);
      }
    } else {
      resetAudioRecorder(); setUploadedFiles(prev => prev.filter(f => f.id !== 'recorded_audio'));
      audioRecorderState.startRecording();
    }
  };

  if (!isOpen) return null;
  const canEditTagDetails = !isViewMode || (isViewMode && existingTag?.creatorId === currentUserId); 
  const canAddMessage = isViewMode; 


  const renderCompactAttachmentControls = (isReplyContext = false) => (
    <div className={cn("flex items-center mt-1.5", isReplyContext ? "justify-between" : "justify-start")}>
        <div className="flex gap-1"> {/* Reduced gap for icons */}
            <button
                onClick={() => !isReplyContext && fileInputRef.current?.click()}
                disabled={isReplyContext}
                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={isReplyContext ? "Attach file (disabled)" : "Attach file"}
            >
                <Paperclip className="h-4 w-4" />
            </button>
            <button
                onClick={() => !isReplyContext && fileInputRef.current?.click()} 
                disabled={isReplyContext}
                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={isReplyContext ? "Attach image (disabled)" : "Attach image"}
            >
                <ImageIcon className="h-4 w-4" />
            </button>
            <button
                onClick={() => !isReplyContext && handleAudioRecordToggle()}
                disabled={isReplyContext}
                className={`p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    audioRecorderState.isRecording && !isReplyContext ? 'text-red-500 bg-red-100 animate-pulse' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title={isReplyContext ? "Record voice (disabled)" : (audioRecorderState.isRecording ? "Stop recording" : (audioRecorderState.audioBlob ? "Re-record voice" : "Record voice"))}
            >
                <Mic className="h-4 w-4" />
            </button>
        </div>
        {isReplyContext && (
            <button 
                onClick={handlePostNewMainComment} 
                disabled={isLoading || !nextMessageText.trim()}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 transition-colors text-xs font-medium flex items-center gap-1"
            >
                <Send className="h-3.5 w-3.5" /> Post
            </button>
        )}
    </div>
  );


  return (
    <div
        ref={popupRef}
        className="tag-popup-content fixed bg-white border border-gray-300 rounded-xl shadow-2xl w-[450px] flex flex-col max-h-[90vh] overflow-hidden z-[55]"
        style={{ left: `${popupPosition.x}px`, top: `${popupPosition.y}px`, cursor: isDragging ? 'grabbing' : 'default' }}
        onClick={(e) => e.stopPropagation()} 
    >
      <div className="popup-drag-handle flex justify-between items-center p-3 border-b bg-slate-700 text-white rounded-t-xl cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDownDrag}>
        <div className="flex items-center gap-2"> <TagIcon className="h-5 w-5" />
          <span className="font-semibold text-base">{existingTag ? `Tag by ${existingTag.creatorName}` : 'Create New Tag'}</span>
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-slate-600 transition-colors"> <X className="h-5 w-5" /> </button>
      </div>

      <div className="p-4 flex-grow overflow-y-auto scrollbar-thin space-y-3.5"> 
        
        {/* === CREATE NEW TAG VIEW === */}
        {!isViewMode ? (
          <>
            <div className="pb-2.5"> 
              {/* Label removed for new tag initial comment */}
              <textarea
                id="tag-initial-comment"
                className="w-full p-2.5 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="Add a comment or @mention someone"
                rows={2} // Reduced rows for compactness
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
              />
               <p className="text-xs text-gray-500 mt-1 text-right">{comment.length}/{MAX_COMMENT_LENGTH}</p>
              {renderCompactAttachmentControls(false)}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,audio/*"/>


            <div ref={staffDropdownRef} className="pt-2"> 
              <label className="block text-sm font-medium text-gray-700 mb-1">Notify Staff <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-lg min-h-[40px] items-center">
                {selectedStaff.map(staff => (
                  <span key={staff.id} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {staff.name}
                    <button onClick={() => handleStaffRemove(staff.id)} className="ml-1 text-blue-500 hover:text-blue-700"> <X className="h-3 w-3" /> </button>
                  </span>
                ))}
                <input ref={staffInputRef} type="text" placeholder={selectedStaff.length === 0 ? "Search and add staff..." : "Add more..."}
                  value={staffSearchTerm} onChange={(e) => { setStaffSearchTerm(e.target.value); setShowStaffDropdown(true); }}
                  onFocus={() => setShowStaffDropdown(true)} className="flex-grow p-1 outline-none text-sm min-w-[100px]" />
              </div>
              {showStaffDropdown && filteredStaff.length > 0 && (
                <div className="mt-1 border border-gray-300 rounded-lg shadow-lg bg-white max-h-40 overflow-y-auto z-10 absolute w-[calc(100%-2rem)]">
                  {filteredStaff.map(staff => ( <div key={staff.id} onClick={() => handleStaffSelect(staff)} className="p-2.5 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2">
                      {staff.avatarUrl && <img src={staff.avatarUrl} alt={staff.name} className="h-6 w-6 rounded-full" />} <span>{staff.name}</span> </div> ))}
                </div>
              )}
              {selectedStaff.length === 0 && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5"/>Tag at least one staff member.</p>}
            </div>
            
            {uploadedFiles.length > 0 && (
                <div className="pt-2"> 
                    <span className="text-xs font-medium text-gray-500">Attachments:</span>
                    <div className="flex flex-wrap gap-2 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
                    {uploadedFiles.map((upFile) => ( <div key={upFile.id} className="relative w-14 h-14 group">
                        <a href={upFile.previewUrl} target="_blank" rel="noopener noreferrer" title={upFile.file.name || 'attachment'}>
                            {(upFile.type === 'image' || upFile.type === 'drawing') && upFile.previewUrl && <img src={upFile.previewUrl} alt="Preview" className="w-full h-full object-cover rounded border border-gray-300 bg-white" />}
                            {upFile.type === 'audio' && upFile.previewUrl && ( <audio src={upFile.previewUrl} controls className="w-full h-full object-cover rounded border border-gray-300 bg-white p-1" /> )}
                             {upFile.type === 'audio' && !upFile.previewUrl && ( <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded border border-gray-300"> <Mic className="h-6 w-6 text-gray-600" /> </div> )}
                        </a>
                        <button onClick={() => handleRemoveUploadedFile(upFile.id)} className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 text-white rounded-full p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Remove"> <X className="h-2.5 w-2.5" /> </button>
                        </div>))}
                    </div>
                </div>
            )}
            
            <div className="pt-2"> 
                 <button onClick={handleToggleDrawingPad} className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs transition-colors mt-1 ${showDrawingPad ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}> <Brush className="h-4 w-4" /> {showDrawingPad ? 'Hide Drawing Pad' : 'Add Inline Drawing'} </button>
                {showDrawingPad && ( <div className="mt-2 pt-2 border-t border-gray-200">
                    <DrawingToolbar drawingState={drawingState} onStateChange={(key, value) => setDrawingState(prev => ({ ...prev, [key]: value }))} colorOptions={DRAWING_COLORS} lineWidthOptions={DRAWING_LINE_WIDTHS} />
                    <DrawingCanvas width={400} height={180} drawingState={drawingState} onDrawEnd={handleInlineDrawEnd} initialDrawingDataUrl={mainAnnotationUrl || undefined} className="mt-2"/>
                </div> )}
                <button onClick={handleStartFullPageDraw} className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md text-xs transition-colors"> <Edit3 className="h-4 w-4" /> Draw on Full Page </button>
            </div>
          </>
        ) : null}

        {/* === VIEW/EDIT EXISTING TAG VIEW === */}
        {isViewMode && existingTag ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Message <span className="text-xs text-gray-500 font-normal">(by {existingTag.currentCommentAuthorName})</span>
              </label>
              <div className="w-full p-2.5 text-sm border border-gray-200 bg-gray-50 rounded-lg min-h-[60px]">
                <p className="whitespace-pre-wrap">{comment}</p>
              </div>
            </div>

            {existingTag.taggedStaffIds.length > 0 && (
                <div className="mt-2.5"> <label className="block text-sm font-medium text-gray-700 mb-1">Tagged Staff</label> <div className="flex flex-wrap gap-1.5">
                    {availableStaff.filter(s => existingTag.taggedStaffIds.includes(s.id)).map(staff => (
                        <span key={staff.id} className="flex items-center gap-2 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                           {staff.avatarUrl && <img src={staff.avatarUrl} alt={staff.name} className="h-4 w-4 rounded-full" />} {staff.name} </span> ))} </div> </div>
            )}
            
            {uploadedFiles.length > 0 && (
                <div className="mt-2.5"> <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50 max-h-32 overflow-y-auto scrollbar-thin">
                {uploadedFiles.map((upFile) => ( <div key={upFile.id} className="relative w-16 h-16 group">
                    <a href={upFile.remoteUrl || upFile.previewUrl} target="_blank" rel="noopener noreferrer" title={upFile.file.name || 'attachment'}>
                        {(upFile.type === 'image' || upFile.type === 'drawing') && upFile.previewUrl && <img src={upFile.previewUrl} alt="Preview" className="w-full h-full object-cover rounded border border-gray-300 bg-white" />}
                         {upFile.type === 'audio' && upFile.remoteUrl && ( <audio src={upFile.remoteUrl} controls className="w-full h-full object-cover rounded border border-gray-300 bg-white p-1" /> )}
                        {upFile.type === 'audio' && !upFile.remoteUrl && ( <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded border border-gray-300"> <Mic className="h-7 w-7 text-gray-600" /> </div> )}
                    </a>
                    </div> ))} </div> </div>
            )}

            {existingTag.commentHistory && existingTag.commentHistory.length > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-slate-500"/> Comment History</h4>
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {existingTag.commentHistory.map((histItem, index) => (
                    <div key={index} className="p-2 bg-white rounded-md shadow-sm text-xs border border-gray-100">
                      <div className="flex justify-between items-center mb-0.5 text-slate-500">
                        <span className="font-semibold text-slate-700">{histItem.authorName}</span>
                        <span className="text-[10px] flex items-center gap-1"><Clock className="h-2.5 w-2.5"/> {new Date(histItem.timestamp).toLocaleString([], { dateStyle:'short', timeStyle:'short' })}</span>
                      </div>
                      <p className="text-gray-600 whitespace-pre-wrap">{histItem.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {canAddMessage && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-200"> 
                <textarea id="tag-next-message" value={nextMessageText} onChange={(e) => setNextMessageText(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                  placeholder="Add a comment or @mention someone" rows={2} 
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
                <p className="text-xs text-gray-500 mt-1 text-right">{nextMessageText.length}/{MAX_COMMENT_LENGTH}</p>
                {renderCompactAttachmentControls(true)}
              </div>
            )}
          </>
        ) : null}
      </div>
      
      {(!isViewMode || (isViewMode && canEditTagDetails)) && ( 
        <div className="flex justify-end gap-3 p-3.5 border-t bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors"> Cancel </button>
          <button onClick={handleSaveTagData} disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
            <Save className="h-4 w-4" /> {isLoading ? 'Saving...' : (isViewMode ? 'Save Changes' : 'Create Tag')}
          </button>
        </div>
      )}
    </div>
  );
};

export default TagPopup;
        