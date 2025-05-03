import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Tag, Image, Mic, Brush } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TagData {
  id: string;
  creatorId: string;
  comment: string;
  taggedStaffIds: string[];
  attachments: Array<{
    type: 'image' | 'audio' | 'drawing';
    url: string;
  }>;
  coords: {
    x: number;
    y: number;
  };
  timestamp: number;
  drawingData?: string;
}

export function TagNotificationView() {
  const { tagData } = useLoaderData() as { tagData: TagData };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-blue-500" />
          <h1 className="text-xl font-semibold">Tag Notification</h1>
        </div>

        <div className="space-y-4">
          {/* Comment */}
          {tagData.comment && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700">{tagData.comment}</p>
            </div>
          )}

          {/* Attachments */}
          {tagData.attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
              <div className="grid grid-cols-2 gap-2">
                {tagData.attachments.map((attachment, index) => (
                  <div key={index} className="relative">
                    {attachment.type === 'image' && (
                      <img
                        src={attachment.url}
                        alt="Tag attachment"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    {attachment.type === 'drawing' && (
                      <img
                        src={attachment.url}
                        alt="Drawing"
                        className="w-full h-32 object-contain rounded-md bg-white"
                      />
                    )}
                    {attachment.type === 'audio' && (
                      <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
                        <audio controls className="w-full">
                          <source src={attachment.url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drawing */}
          {tagData.drawingData && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Drawing</h3>
              <img
                src={tagData.drawingData}
                alt="Drawing"
                className="w-full h-64 object-contain rounded-md bg-white"
              />
            </div>
          )}

          {/* Reply Section */}
          <div className="border-t pt-4">
            <textarea
              className="w-full p-2 text-sm border rounded-md resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Add a reply..."
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button>Send Reply</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 