import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Zap, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useClientsStore } from '../store/useClientsStore';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

const Messages: React.FC = () => {
  const { clients, fetchClients } = useClientsStore();
  const [selectedClient, setSelectedClient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isAI: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };
  
  const handleGenerateResponse = async () => {
    if (messages.length === 0) {
      toast.error('Send a message first before generating a response');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI response generation with a delay
    setTimeout(() => {
      const lastMessage = messages[messages.length - 1];
      
      // Mock AI response based on last message
      let aiResponse = 'Thank you for your message. I\'ll get back to you as soon as possible.';
      
      if (lastMessage.text.toLowerCase().includes('appointment')) {
        aiResponse = 'I\'d be happy to schedule an appointment for you. Would you prefer morning or afternoon?';
      } else if (lastMessage.text.toLowerCase().includes('price') || lastMessage.text.toLowerCase().includes('cost')) {
        aiResponse = 'Our service pricing varies based on your specific needs. I\'d be happy to provide you with a detailed quote.';
      } else if (lastMessage.text.toLowerCase().includes('cancel')) {
        aiResponse = 'I understand you need to cancel. No problem at all. Is there a specific reason or would you like to reschedule?';
      }
      
      const newAIMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleClearConversation = () => {
    setMessages([]);
  };
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
          <p className="mt-1 text-sm text-gray-600">
            Draft responses with AI assistance
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <Select
                  label="Client"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  options={clients.map(client => ({
                    value: client.id,
                    label: client.name
                  }))}
                  placeholder="Select a client"
                />
                
                <div>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    onClick={handleClearConversation}
                    className="mt-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Conversation
                  </Button>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">AI Assistant Tips</h3>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li>• Use the AI to draft responses to common client questions</li>
                    <li>• Generate appointment scheduling messages</li>
                    <li>• Create follow-up messages for no-shows</li>
                    <li>• Craft payment reminders for overdue invoices</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[600px]">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Conversation</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mb-3 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start typing to create a message</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.isAI 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  onClick={handleGenerateResponse}
                  loading={isGenerating}
                  disabled={messages.length === 0}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  AI Response
                </Button>
                
                <div className="flex-1">
                  <Input
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;