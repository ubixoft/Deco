import { ChatAction, ChatState } from '../types/chat';

// Action types
export const SET_CHATS = 'SET_CHATS';
export const ADD_CHAT = 'ADD_CHAT';
export const REMOVE_CHAT = 'REMOVE_CHAT';
export const UPDATE_CHAT = 'UPDATE_CHAT';
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const SET_DRAWER_OPEN = 'SET_DRAWER_OPEN';
export const SET_LOADING = 'SET_LOADING';
export const SET_SELECTED_MODEL = 'SET_SELECTED_MODEL';
export const TOGGLE_MODEL_SELECTOR = 'TOGGLE_MODEL_SELECTOR';
export const SET_MODEL_SELECTOR = 'SET_MODEL_SELECTOR';
export const TOGGLE_SEARCH_MODAL = 'TOGGLE_SEARCH_MODAL';
export const SET_SEARCH_MODAL = 'SET_SEARCH_MODAL';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const SET_REQUESTING_CHAT_ID = 'SET_REQUESTING_CHAT_ID';

// Initial state
export const initialChatState: ChatState = {
  chats: [],
  currentChatId: null,
  isDrawerOpen: false,
  isLoading: false,
  selectedModel: 'openai:gpt-4-turbo',
  showModelSelector: false,
  showSearchModal: false,
  searchQuery: '',
  requestingChatId: null,
};

// Reducer
export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case SET_CHATS:
      return {
        ...state,
        chats: action.payload,
        currentChatId: action.payload.length > 0 ? action.payload[0].id : null,
      };
    
    case ADD_CHAT:
      return {
        ...state,
        chats: [action.payload, ...state.chats],
        currentChatId: action.payload.id,
      };
    
    case REMOVE_CHAT: {
      const filteredChats = state.chats.filter(chat => chat.id !== action.payload);
      return {
        ...state,
        chats: filteredChats,
        currentChatId: filteredChats.length > 0 ? filteredChats[0].id : null,
      };
    }
    
    case UPDATE_CHAT: {
      const updatedChat = action.payload;
      return {
        ...state,
        chats: state.chats.map(chat => 
          chat.id === updatedChat.id ? updatedChat : chat
        ),
      };
    }
    
    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChatId: action.payload,
      };
    
    case TOGGLE_DRAWER:
      return {
        ...state,
        isDrawerOpen: !state.isDrawerOpen,
      };
    
    case SET_DRAWER_OPEN:
      return {
        ...state,
        isDrawerOpen: action.payload,
      };
    
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case SET_SELECTED_MODEL:
      return {
        ...state,
        selectedModel: action.payload,
      };
    
    case TOGGLE_MODEL_SELECTOR:
      return {
        ...state,
        showModelSelector: !state.showModelSelector,
      };
    
    case SET_MODEL_SELECTOR:
      return {
        ...state,
        showModelSelector: action.payload,
      };
    
    case TOGGLE_SEARCH_MODAL:
      return {
        ...state,
        showSearchModal: !state.showSearchModal,
      };
    
    case SET_SEARCH_MODAL:
      return {
        ...state,
        showSearchModal: action.payload,
      };
    
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    case SET_REQUESTING_CHAT_ID:
      return {
        ...state,
        requestingChatId: action.payload,
      };
    
    default:
      return state;
  }
}; 