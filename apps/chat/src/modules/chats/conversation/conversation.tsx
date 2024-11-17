import { Bot, MessageCircle, RefreshCwIcon, SendIcon, User, WandSparklesIcon } from 'lucide-react';
import { useState } from 'react';

import { useI18n } from '~/i18n';

import { ChatBackground } from './chat-background';
import { ChatConfigPanel } from './chat-config-panel';

type Message = {
  id: string;
  text: string;
  sender: 'ai' | 'human';
  timestamp: string;
  model?: string; // Add model field
};

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Cześć! Jak mogę Ci dzisiaj pomóc?',
    sender: 'ai',
    model: 'GPT-4',
    timestamp: '10:00',
  },
  {
    id: '2',
    text: 'Potrzebuję pomocy z komponentami React',
    sender: 'human',
    timestamp: '10:01',
  },
  {
    id: '3',
    text: 'Chętnie pomogę! Jaki konkretnie aspekt komponentów React Cię interesuje?',
    sender: 'ai',
    model: 'GPT-4',
    timestamp: '10:01',
  },
];

export function Conversation() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const t = useI18n().pack.chat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim())
      return;

    setMessages([...messages, {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'human',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMessage('');
  };

  const handleRefresh = (messageId: string) => {
    // TODO: Implement refresh logic
    // eslint-disable-next-line no-console
    console.log('Refreshing message:', messageId);
  };

  const isLastAiMessage = (index: number) => {
    return index === messages.length - 1 && messages[index].sender === 'ai';
  };

  return (
    <div className="flex gap-6 mx-auto max-w-7xl">
      <div className="relative flex flex-col flex-1 h-[calc(100vh-200px)]">
        <ChatBackground />

        <div className="relative z-10 flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`mb-6 flex items-start gap-2 ${
                message.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${message.sender === 'ai' ? 'bg-gray-100' : 'bg-gray-700'}`}
              >
                {message.sender === 'ai'
                  ? (
                      <Bot className="w-5 h-5 text-gray-600" />
                    )
                  : (
                      <User className="w-5 h-5 text-white" />
                    )}
              </div>

              <div
                className={`relative max-w-[70%] px-4 py-2 rounded-2xl border
                  ${message.sender === 'ai'
              ? 'bg-gray-100 before:border-gray-100 before:left-[-8px] border-gray-200'
              : 'bg-gray-700 text-white before:border-gray-700 before:right-[-8px] border-gray-600'
            }
                  before:absolute before:top-[12px]
                  before:border-8 before:border-transparent
                  before:border-t-8
                  ${message.sender === 'ai'
              ? 'before:border-l-0 before:border-r-[12px]'
              : 'before:border-r-0 before:border-l-[12px]'
            }
                `}
              >
                <p>{message.text}</p>
                <div className="flex justify-between items-center mt-1 text-xs">
                  <span className="opacity-50">{message.timestamp}</span>
                  {message.sender === 'ai'
                    ? (
                        <div className="flex items-center gap-2">
                          {isLastAiMessage(index) && (
                            <button
                              onClick={() => handleRefresh(message.id)}
                              type="button"
                              className="hover:bg-gray-200 p-1 rounded transition-colors"
                              title="Refresh response"
                            >
                              <RefreshCwIcon size={14} className="opacity-50 hover:opacity-100" />
                            </button>
                          )}
                          {message.model && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <WandSparklesIcon size={12} />
                              <span>{message.model}</span>
                            </div>
                          )}
                        </div>
                      )
                    : (
                        <div className="flex items-center gap-1 opacity-75 text-white">
                          <User size={12} />
                          <span>You</span>
                        </div>
                      )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative border-gray-200 bg-white p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="flex-1 border-gray-200 py-2 pr-4 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter message..."
            />
            <div className="top-1/2 left-7 absolute -translate-y-1/2">
              <MessageCircle size={18} className="text-gray-400" />
            </div>
            <button
              type="submit"
              className="flex flex-row items-center bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded-lg text-white transition-colors"
            >
              <SendIcon size={16} className="mr-2" />
              {t.actions.send}
            </button>
          </div>
        </form>
      </div>
      <ChatConfigPanel />
    </div>
  );
}
