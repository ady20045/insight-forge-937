import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import CSVUpload from "./CSVUpload";
import { Send, Upload, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  sessionId: string;
}

const ChatInterface = ({ sessionId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: "I'm an AI assistant ready to help you analyze your data. Please upload a CSV file or ask me a question about your data.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleCSVUpload = (file: File, preview: string[][]) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: `Uploaded CSV file: ${file.name} (${file.size} bytes)\n\nPreview:\n${preview
        .slice(0, 3)
        .map((row) => row.join(", "))
        .join("\n")}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    setShowUpload(false);

    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded and analyzed`,
    });

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: `I've successfully processed your CSV file "${file.name}". The data looks good! What would you like me to analyze or explain about your data?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Bot className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-semibold mb-2">Ready to analyze your data</h3>
              <p className="text-muted-foreground">
                Upload a CSV file or ask me anything about data science
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot size={18} className="text-primary" />
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          {showUpload ? (
            <CSVUpload
              onUpload={handleCSVUpload}
              onCancel={() => setShowUpload(false)}
            />
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowUpload(true)}
                className="flex-shrink-0"
              >
                <Upload size={20} />
              </Button>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about your data..."
                className="min-h-[50px] max-h-[200px] resize-none bg-background/50"
                rows={1}
              />

              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 bg-primary hover:bg-primary/90"
                size="icon"
              >
                <Send size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
