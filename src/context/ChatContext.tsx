import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import * as marked from 'marked';
import { v4 as uuidv4 } from 'uuid';
import { useSDK } from './SDKContext';
import { chatReducer, initialChatState } from './chatReducer';
import { Chat, ChatContextType, ChatMessage } from '../types/chat';
import {
  SET_CHATS,
  ADD_CHAT,
  REMOVE_CHAT,
  UPDATE_CHAT,
  SET_CURRENT_CHAT,
  SET_DRAWER_OPEN,
  SET_SELECTED_MODEL,
  TOGGLE_MODEL_SELECTOR,
  SET_MODEL_SELECTOR,
  TOGGLE_SEARCH_MODAL,
  SET_SEARCH_MODAL,
  SET_SEARCH_QUERY,
  SET_REQUESTING_CHAT_ID,
} from './chatReducer';

// Helper function to safely parse markdown
const parseMarkdown = (text: string | undefined | null): string => {
  if (!text) return '';
  // Handle the case where marked.parse returns a Promise
  try {
    const result = marked.parse(text);
    if (typeof result === 'string') {
      return result;
    }
    // If it's a Promise, return empty string (this should be handled better in production)
    return text;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return text;
  }
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { sdk } = useSDK();
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  useEffect(() => {
    console.log('sdk', sdk);
  }, [sdk]);

  // Load chats from storage
  useEffect(() => {
    if (!sdk || !sdk.ready()) return;

    const loadChats = async () => {
      try {
        const files = await sdk.fs.list('~/Chats/');
        const chatFiles = files
          .map(file => file.split('/').splice(-1)[0])
          .filter(file => file.startsWith('chat-'));

        const loadedChats: Chat[] = [];

        for (const file of chatFiles) {
          try {
            const content = await sdk.fs.read(`~/Chats/${file}`);
            const chatData = JSON.parse(content);
            loadedChats.push({ ...chatData, _ref: file });
          } catch (error) {
            console.error(`Error loading chat ${file}:`, error);
          }
        }

        // Sort chats by last message timestamp (newest first)
        loadedChats.sort((a, b) => {
          const aLastMessage = a.messages[a.messages.length - 1];
          const bLastMessage = b.messages[b.messages.length - 1];

          if (!aLastMessage) return 1;
          if (!bLastMessage) return -1;

          const aTime = new Date(aLastMessage.timestamp);
          const bTime = new Date(bLastMessage.timestamp);

          return bTime.getTime() - aTime.getTime();
        });

        dispatch({ type: SET_CHATS, payload: loadedChats });
      } catch (error) {
        console.error('Error loading chats:', error);
        
        // If there's an error, create a default chat
        createNewChat();
      }
    };

    loadChats();
  }, [sdk]);

  // Save chats when they change
  useEffect(() => {
    const saveChats = async () => {
      if (!sdk || !sdk.ready() || state.chats.length === 0) return;

      try {
        // Ensure the Chats directory exists
        try {
          await sdk.fs.mkdir('~/Chats/', { recursive: true });
        } catch (error) {
          // Directory might already exist, continue
        }

        // Save each chat in its own file
        for (const chat of state.chats) {
          try {
            await sdk.fs.write(`~/Chats/${chat._ref}`, JSON.stringify(chat));
          } catch (error) {
            console.error(`Error saving chat ${chat.id}:`, error);
          }
        }
      } catch (error) {
        console.error('Error saving chats:', error);
      }
    };

    saveChats();
  }, [state.chats, sdk]);

  const createNewChat = () => {
    const uuid = uuidv4();
    const chatTitle = 'New Chat';
    const file = `chat-${chatTitle.replace(/\s/g, '-')}-${uuid}.json`;

    const newChat: Chat = {
      id: uuid,
      title: chatTitle,
      messages: [],
      _ref: file,
    };

    dispatch({ type: ADD_CHAT, payload: newChat });
    dispatch({ type: SET_DRAWER_OPEN, payload: false });
  };

  const selectChat = (id: string) => {
    dispatch({ type: SET_CURRENT_CHAT, payload: id });
    dispatch({ type: SET_DRAWER_OPEN, payload: false });
  };

  const deleteChat = async (id: string) => {
    if (!sdk || !sdk.ready()) return;

    try {
      const chatToDelete = state.chats.find(chat => chat.id === id);
      if (chatToDelete) {
        await sdk.fs.remove(`~/Chats/${chatToDelete._ref}`);
        dispatch({ type: REMOVE_CHAT, payload: id });
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const generateChatTitle = async (chatId: string) => {
    if (!sdk || !sdk.ready()) return;

    try {
      const currentChat = state.chats.find(chat => chat.id === chatId);
      if (!currentChat || currentChat.messages.length === 0) return;

      const response = await sdk.ai.generateText({
        model: state.selectedModel,
        messages: [
          ...currentChat.messages.map(msg => ({
            role: msg.role,
            content: msg.role === 'assistant' ? msg.content.replace(/<[^>]*>/g, '') : msg.content,
          })),
          {
            role: 'user',
            content: 'Create a short title for this conversation in the same language as the previous messages (ignore the language of this message). Your response should only contain the title and nothing else.',
          },
        ],
      });

      if (response.text) {
        // Clean up the title - remove quotes and newlines
        const cleanTitle = response.text.replace(/["\n]/g, '').trim();
        
        const updatedChat: Chat = {
          ...currentChat,
          title: cleanTitle,
        };

        dispatch({ type: UPDATE_CHAT, payload: updatedChat });
      }
    } catch (error) {
      console.error('Error generating title:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!sdk || !content.trim()) return;
    
    const currentChatId = state.currentChatId;
    if (!currentChatId) return;
    
    dispatch({ type: SET_REQUESTING_CHAT_ID, payload: currentChatId });
    
    try {
      const currentChat = state.chats.find(chat => chat.id === currentChatId);
      if (!currentChat) return;

      // Add user message
      const userMessageId = uuidv4();
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      // Add temporary assistant message (loading)
      const assistantMessageId = uuidv4();
      const tempAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '<div class="animate-pulse">Thinking...</div>',
        model: state.selectedModel,
        timestamp: new Date(),
      };

      const updatedChat: Chat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage, tempAssistantMessage],
      };

      // Update the current chat with user message and loading assistant message
      dispatch({ type: UPDATE_CHAT, payload: updatedChat });

      // If this is the first message in the chat, move it to the top
      if (currentChat.messages.length === 0) {
        const updatedChats = state.chats.filter(chat => chat.id !== currentChatId);
        dispatch({ type: SET_CHATS, payload: [updatedChat, ...updatedChats] });
      }

      // Generate response
      const response = await sdk.ai.generateText({
        model: state.selectedModel,
        messages: updatedChat.messages
          .filter(msg => msg.id !== assistantMessageId) // Remove temporary message
          .map(msg => ({
            role: msg.role,
            content: msg.role === 'assistant' ? msg.content.replace(/<[^>]*>/g, '') : msg.content,
          })),
      });
      
      if (!response.text) {
        throw new Error('Invalid response format');
      }

      // Create final assistant message
      const finalAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: parseMarkdown(response.text),
        model: state.selectedModel,
        timestamp: new Date(),
      };

      // Update chat with final assistant message
      const finalUpdatedChat: Chat = {
        ...updatedChat,
        messages: [
          ...updatedChat.messages.filter(msg => msg.id !== assistantMessageId),
          finalAssistantMessage,
        ],
      };

      dispatch({ type: UPDATE_CHAT, payload: finalUpdatedChat });

      // Generate title for new chats
      if (currentChat.title === 'New Chat') {
        await generateChatTitle(currentChatId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Find the current chat again as it might have changed
      const currentChat = state.chats.find(chat => chat.id === currentChatId);
      if (currentChat) {
        // Update the loading message with an error
        const updatedMessages = currentChat.messages.map(msg => {
          if (msg.role === 'assistant' && msg.content.includes('animate-pulse')) {
            return {
              ...msg,
              content: 'Error: Failed to generate response. Please try again.',
            };
          }
          return msg;
        });

        const updatedChat: Chat = {
          ...currentChat,
          messages: updatedMessages,
        };

        dispatch({ type: UPDATE_CHAT, payload: updatedChat });
      }
    } finally {
      dispatch({ type: SET_REQUESTING_CHAT_ID, payload: null });
    }
  };

  const regenerateMessage = async (message: ChatMessage) => {
    if (!sdk || !sdk.ready() || !sdk.ai) return;
    
    const currentChatId = state.currentChatId;
    if (!currentChatId) return;
    
    try {
      const currentChat = state.chats.find(chat => chat.id === currentChatId);
      if (!currentChat) return;

      // Find the index of the message to regenerate
      const messageIndex = currentChat.messages.findIndex(msg => msg.id === message.id);
      if (messageIndex === -1) return;

      // Get the previous user message
      let userMessage = '';
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (currentChat.messages[i].role === 'user') {
          userMessage = currentChat.messages[i].content;
          break;
        }
      }

      if (!userMessage) return;

      // Update message with loading state
      const updatedMessages = [...currentChat.messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: '<div class="animate-pulse">Regenerating...</div>',
      };

      const updatedChat: Chat = {
        ...currentChat,
        messages: updatedMessages,
      };

      dispatch({ type: UPDATE_CHAT, payload: updatedChat });

      // Generate new response
      const response = await sdk.ai.generateText({
        model: state.selectedModel,
        messages: [{ role: 'user', content: userMessage }],
      });

      if (!response.text) {
        throw new Error('Invalid response format');
      }

      // Update with new content
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: parseMarkdown(response.text),
        timestamp: new Date(),
      };

      const finalUpdatedChat: Chat = {
        ...currentChat,
        messages: updatedMessages,
      };

      dispatch({ type: UPDATE_CHAT, payload: finalUpdatedChat });
    } catch (error) {
      console.error('Error regenerating message:', error);
      
      // Find the current chat again as it might have changed
      const currentChat = state.chats.find(chat => chat.id === currentChatId);
      if (currentChat) {
        // Find the message again
        const messageIndex = currentChat.messages.findIndex(msg => msg.id === message.id);
        if (messageIndex !== -1) {
          const updatedMessages = [...currentChat.messages];
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            content: 'Error: Failed to regenerate response. Please try again.',
          };

          const updatedChat: Chat = {
            ...currentChat,
            messages: updatedMessages,
          };

          dispatch({ type: UPDATE_CHAT, payload: updatedChat });
        }
      }
    }
  };

  const deleteMessage = (message: ChatMessage) => {
    const currentChatId = state.currentChatId;
    if (!currentChatId) return;

    const currentChat = state.chats.find(chat => chat.id === currentChatId);
    if (!currentChat) return;

    const updatedMessages = currentChat.messages.filter(msg => msg.id !== message.id);
    
    const updatedChat: Chat = {
      ...currentChat,
      messages: updatedMessages,
    };

    dispatch({ type: UPDATE_CHAT, payload: updatedChat });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        // Could add a toast notification here
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };

  const selectModel = (model: string) => {
    dispatch({ type: SET_SELECTED_MODEL, payload: model });
    dispatch({ type: SET_MODEL_SELECTOR, payload: false });
  };

  const toggleModelSelector = () => {
    dispatch({ type: TOGGLE_MODEL_SELECTOR });
  };

  const toggleSearchModal = () => {
    dispatch({ type: TOGGLE_SEARCH_MODAL });
  };

  const closeSearchModal = (e: React.MouseEvent) => {
    // @ts-ignore - target might not have classList
    if (e.target.classList?.contains('modal-overlay')) {
      dispatch({ type: SET_SEARCH_MODAL, payload: false });
    }
  };

  const selectChatAndCloseSearch = (chatId: string) => {
    dispatch({ type: SET_CURRENT_CHAT, payload: chatId });
    dispatch({ type: SET_SEARCH_MODAL, payload: false });
    dispatch({ type: SET_SEARCH_QUERY, payload: '' });
  };

  // Memoized context value
  const contextValue: ChatContextType = {
    state: { ...state },
    dispatch,
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage,
    regenerateMessage,
    deleteMessage,
    copyMessage,
    selectModel,
    toggleModelSelector,
    toggleSearchModal,
    closeSearchModal,
    selectChatAndCloseSearch,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}; 