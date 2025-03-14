// Chat types

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  _ref: string; // Reference to the file where the chat is stored
}

export interface Model {
  value: string;
  name: string;
  provider: string;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isDrawerOpen: boolean;
  isLoading: boolean;
  selectedModel: string;
  showModelSelector: boolean;
  showSearchModal: boolean;
  searchQuery: string;
  requestingChatId: string | null;
}

export interface ChatAction {
  type: string;
  payload?: any;
}

// Context types
export interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (message: ChatMessage) => Promise<void>;
  deleteMessage: (message: ChatMessage) => void;
  copyMessage: (content: string) => void;
  selectModel: (model: string) => void;
  toggleModelSelector: () => void;
  toggleSearchModal: () => void;
  closeSearchModal: (e: React.MouseEvent) => void;
  selectChatAndCloseSearch: (chatId: string) => void;
} 