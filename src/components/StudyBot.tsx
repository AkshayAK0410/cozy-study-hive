import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, Bot, X, MessageSquare, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const formatMessage = (content: string) => {
  // Replace bullet points with custom styled ones
  return content.replace(/^[•\-*]\s/gm, '• ').split('\n').map((line, i) => {
    if (line.startsWith('• ')) {
      return (
        <div key={i} className="flex items-start space-x-2 ml-2 mb-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2" />
          <span>{line.substring(2)}</span>
        </div>
      );
    }
    return <p key={i} className="mb-1">{line}</p>;
  });
};

const StudyBot = () => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      content: "Hi! I'm your study buddy. How can I help you today? 📚",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Send message to Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat-bot', {
        body: { 
          message: input,
          history: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }
      });
      
      if (error) throw error;
      
      // Add bot response
      const botMessage: ChatMessage = {
        role: 'bot',
        content: data.response || "I'm sorry, I couldn't process your request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to get response from StudyBot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg w-80 md:w-96 h-[500px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📚</span>
              <div>
                <h3 className="font-medium">StudyBot</h3>
                <p className="text-sm text-muted-foreground">Your cozy study companion</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollAreaRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted text-foreground mr-4'
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 mr-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }} className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything..."
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default StudyBot;
