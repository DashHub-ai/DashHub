import { useState } from 'react';

import { TutorialBox } from '~/components';

export function ChatConfigPanel() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="border-gray-200 p-4 border-l w-96">
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-sm">
            Title of chat
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border-gray-200 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 w-full focus:outline-none"
            placeholder="Enter title..."
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">
            Description of chat
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border-gray-200 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 w-full focus:outline-none min-h-[100px] resize-none"
            placeholder="Enter description..."
          />
        </div>
      </form>

      <TutorialBox
        variant="green"
        title="Chat Configuration"
        icon="⚙️"
        className="mt-6"
        id="chat-config-tutorial"
        showIconAsBackground
      >
        <p className="flex items-start gap-2">
          <span className="text-blue-500">📝</span>
          <span>Title and description help you identify chats in your history</span>
        </p>

        <p className="flex items-start gap-2">
          <span className="text-blue-500">🤖</span>
          <span>Don't worry if left empty - they will be auto-generated based on the chat content</span>
        </p>
      </TutorialBox>
    </div>
  );
}
