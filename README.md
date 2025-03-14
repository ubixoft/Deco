# Chat Application

A modern and responsive chat application built with React, TypeScript, and Tailwind CSS.

## Features

- 💬 Chat with multiple AI models (GPT, Claude, Mistral, Deepseek)
- 📋 Multiple chat sessions with saved history
- 🔍 Search through past conversations
- 🎨 Clean, responsive UI for desktop and mobile
- 📱 Mobile-friendly with drawer navigation
- 🚀 Quick actions to start a new chat

## Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Markdown Rendering**: Marked
- **Unique IDs**: UUID

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chat
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the URL provided in your terminal)

## Usage

1. **Creating a New Chat**
   - Click on the "New Chat" button in the sidebar
   - Start typing your message in the input field

2. **Switching Between Chats**
   - Click on any chat in the sidebar to switch to that conversation

3. **Searching Conversations**
   - Click the search icon in the sidebar header
   - Type your search query to filter through chat titles and messages

4. **Changing AI Model**
   - Click on the model selector button at the bottom of the chat input
   - Choose your preferred AI model from the dropdown

5. **Message Actions**
   - Hover over any assistant message to see available actions:
     - Delete message
     - Regenerate response
     - Copy text

## Configuration

The application can be configured by modifying the following files:

- `src/constants/models.ts`: Available AI models
- `src/context/ChatContext.tsx`: Chat functionality and state management
- `src/context/SDKContext.tsx`: SDK integration

## Development

### File Structure

```
src/
├── components/         # UI components
│   ├── chat/           # Chat-specific components
│   │   ├── ui/         # UI elements for chat
│   │   └── Chat.tsx    # Main chat component
├── constants/          # Application constants
├── context/            # Context providers
├── types/              # TypeScript type definitions
└── main.tsx            # Entry point
```

### Adding New Features

To add new features:

1. Create necessary components in the `src/components` directory
2. Update relevant context providers as needed
3. Add any new types to the `src/types` directory

## License

[MIT](LICENSE)
