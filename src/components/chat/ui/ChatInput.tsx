import { useState, useRef, FormEvent, KeyboardEvent, useEffect } from 'react';
import { useChat } from '../../../context/ChatContext';
import { AVAILABLE_MODELS, MODEL_ICONS } from '../../../constants/models';
import Icon from '../../common/Icon';

// Declare the custom event interface
declare global {
  interface DocumentEventMap {
    'set-input-value': CustomEvent;
  }
}

export default function ChatInput() {
  const { state, sendMessage, selectModel, toggleModelSelector } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Listen for the custom event to set input value
  useEffect(() => {
    const handleSetInputValue = (event: CustomEvent) => {
      if (event && event.detail && typeof event.detail === 'string') {
        setInput(event.detail);
      } else {
        // Get the value from another way like a global variable or localStorage
        // For simplicity, we'll just use a predefined value here
        setInput('Help me with a task');
      }
      
      // Focus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    document.addEventListener('set-input-value', handleSetInputValue);
    
    return () => {
      document.removeEventListener('set-input-value', handleSetInputValue);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isLoading) return;
    
    sendMessage(input);
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const getModelIconType = (modelValue: string) => {
    const model = AVAILABLE_MODELS.find(m => m.value === modelValue);
    if (!model) return 'openai';
    return MODEL_ICONS[model.provider] || 'openai';
  };

  const getModelName = (modelValue: string) => {
    const model = AVAILABLE_MODELS.find(m => m.value === modelValue);
    return model ? model.name : 'Select Model';
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="w-full resize-none border-none bg-transparent outline-none max-h-64"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Type your message here..."
            rows={1}
          />
          
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <div className="relative">
              <button
                type="button"
                onClick={toggleModelSelector}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm transition-colors"
              >
                <Icon 
                  type={getModelIconType(state.selectedModel)} 
                  size={16}
                  className="text-gray-700" 
                />
                <span>{getModelName(state.selectedModel)}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {state.showModelSelector && (
                <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px] max-h-[300px] overflow-y-auto z-10">
                  <div className="p-2 font-bold border-b">Models</div>
                  <ul>
                    {AVAILABLE_MODELS.map((model) => (
                      <li
                        key={model.value}
                        onClick={() => selectModel(model.value)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Icon 
                          type={MODEL_ICONS[model.provider]} 
                          size={16}
                          className="text-gray-700" 
                        />
                        <span>{model.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={state.isLoading || !input.trim()}
              className={`bg-pink-600 hover:bg-pink-700 text-white w-8 h-8 rounded-full flex items-center justify-center ${
                state.isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Icon type="send" size={16} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 