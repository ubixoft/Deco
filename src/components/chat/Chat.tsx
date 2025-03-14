import { useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useSDK } from '../../context/SDKContext';
import Icon from '../common/Icon';
import ChatInput from './ui/ChatInput';
import ChatList from './ui/ChatList';
import ChatMessage from './ui/ChatMessage';
import SearchModal from './ui/SearchModal';

export default function Chat() {
  const { state, toggleSearchModal, createNewChat, dispatch } = useChat();
  const { sdk, isInitializing, reloadSDK } = useSDK();
  
  // Find the current chat
  const currentChat = state.chats.find(chat => chat.id === state.currentChatId) || state.chats[0];
  
  // Function to create and dispatch the custom event
  const setInputText = (text: string) => {
    const event = new CustomEvent('set-input-value', { detail: text });
    document.dispatchEvent(event);
  };
  
  // Helper functions for drawer state
  const closeDrawer = () => dispatch({ type: 'SET_DRAWER_OPEN', payload: false });
  const openDrawer = () => dispatch({ type: 'SET_DRAWER_OPEN', payload: true });
  
  // Quick actions for empty chat
  const quickActions = [
    { 
      text: 'Help me write', 
      action: () => setInputText('Help me write')
    },
    { 
      text: 'Summarize text', 
      action: () => setInputText('Summarize this text:')
    },
    { 
      text: 'Give me advice about', 
      action: () => setInputText('Give me advice about')
    },
    { 
      text: 'Brainstorm ideas for', 
      action: () => setInputText('Brainstorm ideas for')
    }
  ];

  // Create a new chat if there are none - moved to useEffect to avoid render phase state updates
  useEffect(() => {
    if (state.chats.length === 0 && !state.isLoading) {
      createNewChat();
    }
  }, [state.chats.length, state.isLoading, createNewChat]);
  
  // Show loading state while SDK is initializing
  if (isInitializing || !sdk) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-pink-600 animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Chat</h2>
          <p className="text-gray-500 mt-2">Initializing application...</p>
          
          {!sdk && !isInitializing && (
            <div className="mt-4">
              <p className="text-red-500">Failed to initialize the SDK.</p>
              <button 
                onClick={reloadSDK}
                className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Show error state if SDK isn't ready
  if (sdk && !sdk.ready()) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="mb-4 flex justify-center text-red-500">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Connection Error</h2>
          <p className="text-gray-500 mt-2">SDK is not ready. Please refresh the page or try again later.</p>
          <button 
            onClick={reloadSDK}
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar / Drawer */}
      <div 
        className={`
          fixed md:relative md:block z-20 bg-white h-full w-[300px] shadow-md 
          transition-all duration-300 ease-in-out
          ${state.isDrawerOpen ? 'left-0' : '-left-[300px] md:left-0'}
        `}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-lg">Chats</h2>
          <div className="flex items-center gap-2">
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleSearchModal}
              title="Search chats"
            >
              <Icon type="search" size={20} />
            </button>
            <button 
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={closeDrawer}
            >
              <Icon type="close" size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 h-[calc(100%-65px)]">
          <ChatList />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full md:w-[calc(100%-300px)]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
              <Icon type="chat" size={24} className="text-gray-700" />
            </div>
            <h1 className="font-bold text-xl">Chat</h1>
          </div>
          
          <button 
            className="md:hidden text-gray-600 p-2"
            onClick={openDrawer}
          >
            <Icon type="menu" size={24} />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          {currentChat && currentChat.messages.length > 0 ? (
            currentChat.messages.map((message, index) => (
              <ChatMessage 
                key={message.id}
                message={message}
                isLoading={
                  state.isLoading && 
                  state.requestingChatId === currentChat.id && 
                  index === currentChat.messages.length - 1 &&
                  message.role === 'assistant'
                }
              />
            ))
          ) : (
            <div className="h-full flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Start a new conversation</h2>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm"
                    onClick={action.action}
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Input */}
        <ChatInput />
      </div>
      
      {/* Search Modal */}
      <SearchModal />
    </div>
  );
} 