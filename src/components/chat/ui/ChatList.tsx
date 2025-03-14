import { useChat } from '../../../context/ChatContext';
import Icon from '../../common/Icon';

export default function ChatList() {
  const { state, createNewChat, selectChat, deleteChat } = useChat();
  
  return (
    <div className="h-full flex flex-col">
      <button 
        className="flex items-center justify-center gap-2 p-2 text-gray-900 border border-gray-200 rounded-lg mb-4 w-full hover:bg-gray-50 transition-colors"
        onClick={createNewChat}
      >
        <Icon type="plus" size={20} />
        New Chat
      </button>
      
      <ul className="flex flex-col gap-2 overflow-y-auto flex-grow">
        {state.chats.map((chat) => (
          <li 
            key={chat.id}
            className={`
              flex items-center p-3 rounded-lg cursor-pointer
              ${chat.id === state.currentChatId ? 'bg-gray-100 border border-gray-200' : 'bg-gray-50 hover:bg-gray-100'}
            `}
            onClick={() => selectChat(chat.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Icon type="chat" size={16} className="text-gray-600" />
                <span className="text-sm truncate">{chat.title || 'New Chat'}</span>
              </div>
              
              <button
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                title="Delete chat"
              >
                <Icon type="trash" size={16} />
              </button>
            </div>
          </li>
        ))}
        
        {state.chats.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No chats yet. Start a new conversation!
          </div>
        )}
      </ul>
    </div>
  );
} 