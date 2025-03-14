import { useEffect, useRef } from 'react';
import { useChat } from '../../../context/ChatContext';
import Icon from '../../common/Icon';

export default function SearchModal() {
  const { state, closeSearchModal, selectChatAndCloseSearch } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Auto-focus search input when modal opens
    if (state.showSearchModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.showSearchModal]);
  
  // Filter chats based on search query
  const filteredChats = state.chats.filter(chat => {
    if (!state.searchQuery) return true;
    
    const query = state.searchQuery.toLowerCase();
    const title = (chat.title || 'New Chat').toLowerCase();
    
    // Search in chat title
    if (title.includes(query)) return true;
    
    // Search in messages
    return chat.messages.some(message => 
      message.content.toLowerCase().includes(query)
    );
  });
  
  if (!state.showSearchModal) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/25 flex justify-center items-center z-50"
      onClick={closeSearchModal}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon type="search" size={20} className="text-gray-500" />
            </div>
            <input
              ref={inputRef}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Search in conversations..."
              value={state.searchQuery}
              onChange={(e) => useChat().dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            />
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredChats.length > 0 ? (
            <ul>
              {filteredChats.map((chat) => (
                <li 
                  key={chat.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => selectChatAndCloseSearch(chat.id)}
                >
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon type="chat" size={16} className="text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium">{chat.title || 'New Chat'}</p>
                        <p className="text-sm text-gray-500">{chat.messages.length} messages</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No chats found matching your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 