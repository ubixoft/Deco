import './App.css'
import { SDKProvider } from './context/SDKContext'
import { ChatProvider } from './context/ChatContext'
import Chat from './components/chat/Chat'

function App() {
  return (
    <SDKProvider>
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </SDKProvider>
  )
}

export default App
