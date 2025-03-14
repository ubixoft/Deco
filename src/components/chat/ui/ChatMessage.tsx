import { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../../../types/chat';
import { useChat } from '../../../context/ChatContext';
import { AVAILABLE_MODELS, MODEL_ICONS } from '../../../constants/models';
import Icon from '../../common/Icon';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const { copyMessage, deleteMessage, regenerateMessage } = useChat();
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const getModelName = (modelValue?: string) => {
    if (!modelValue) return 'Unknown Model';
    const model = AVAILABLE_MODELS.find(m => m.value === modelValue);
    return model ? model.name : modelValue;
  };

  const formattedTime = new Date(message.timestamp).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).replace(',', ' on');

  return (
    <div className="mb-4 last:mb-0">
      <div className={`message ${message.role === 'user' ? 'flex justify-end' : 'flex'}`}>
        <div 
          className={`max-w-[80%] ${message.role === 'user' ? 'ml-auto' : ''}`}
          onMouseEnter={() => setIsActionsVisible(true)}
          onMouseLeave={() => setIsActionsVisible(false)}
        >
          <div className="flex items-center gap-2">
            {message.role === 'assistant' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md flex items-center justify-center">
                  <Icon type="chat" size={16} className="text-gray-700" />
                </div>
                <span className="font-medium">Chat</span>
              </div>
            )}
            <div className="text-xs text-gray-500">{formattedTime}</div>
          </div>
          
          <div className={`mt-1 p-3 rounded-lg ${
            message.role === 'user' 
              ? 'bg-gray-100 text-gray-900' 
              : 'bg-white text-gray-900'
          }`}>
            {isLoading ? (
              <div className="flex space-x-1 justify-center items-center">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: message.content }} />
            )}

            {message.role === 'assistant' && (
              <div className={`flex gap-3 items-center mt-2 transition-opacity ${isActionsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-2">
                  <button 
                    className="text-gray-500 hover:text-gray-700" 
                    onClick={() => deleteMessage(message)}
                    title="Delete response"
                  >
                    <Icon type="trash" size={16} />
                  </button>
                  <button 
                    className="text-gray-500 hover:text-gray-700" 
                    onClick={() => regenerateMessage(message)}
                    title="Regenerate response"
                  >
                    <Icon type="refresh" size={16} />
                  </button>
                  <button 
                    className="text-gray-500 hover:text-gray-700" 
                    onClick={() => copyMessage(message.content)}
                    title="Copy message"
                  >
                    <Icon type="copy" size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-500">Generated with {getModelName(message.model)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 