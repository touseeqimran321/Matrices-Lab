
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your Matrix AI Assistant. I can help you understand matrix concepts, solve problems, and explain operations. What would you like to know?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const matrixKnowledge = {
    'what is a matrix': 'A matrix is a rectangular array of numbers, symbols, or expressions arranged in rows and columns. For example, a 2×3 matrix has 2 rows and 3 columns.',
    'matrix addition': 'Matrix addition is performed by adding corresponding elements. Both matrices must have the same dimensions. For example: [1,2] + [3,4] = [4,6].',
    'matrix multiplication': 'Matrix multiplication involves taking the dot product of rows from the first matrix with columns of the second matrix. The number of columns in the first matrix must equal the number of rows in the second.',
    'determinant': 'The determinant is a scalar value that can be computed from a square matrix. For a 2×2 matrix [[a,b],[c,d]], the determinant is ad - bc.',
    'transpose': 'The transpose of a matrix is formed by turning rows into columns and columns into rows. If A is m×n, then A^T is n×m.',
    'inverse': 'The inverse of a matrix A is a matrix A^(-1) such that A × A^(-1) = I (identity matrix). Only square matrices with non-zero determinant have inverses.',
    'rref': 'Reduced Row Echelon Form (RREF) is a simplified form of a matrix where each leading entry is 1, and all entries above and below leading entries are 0.',
    'echelon form': 'Row Echelon Form is a matrix form where all nonzero rows are above rows of all zeros, and each leading entry is to the right of the leading entry in the row above it.',
    'rank': 'The rank of a matrix is the maximum number of linearly independent rows or columns. It equals the number of non-zero rows in the RREF.',
    'eigenvalue': 'Eigenvalues are scalars λ such that Av = λv for some non-zero vector v (eigenvector). They represent how much the transformation stretches or shrinks vectors.',
    'linear transformation': 'A linear transformation is a function between vector spaces that preserves vector addition and scalar multiplication. Matrices represent linear transformations.'
  };

  const findBestMatch = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Direct keyword matching
    for (const [key, value] of Object.entries(matrixKnowledge)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }
    
    // Partial matching for common terms
    if (lowerQuery.includes('add') || lowerQuery.includes('sum')) {
      return matrixKnowledge['matrix addition'];
    }
    if (lowerQuery.includes('multiply') || lowerQuery.includes('product')) {
      return matrixKnowledge['matrix multiplication'];
    }
    if (lowerQuery.includes('det')) {
      return matrixKnowledge['determinant'];
    }
    if (lowerQuery.includes('eigen')) {
      return matrixKnowledge['eigenvalue'];
    }
    
    return null;
  };

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m here to help you with matrix operations and concepts. Feel free to ask me anything about matrices!';
    }
    
    // Check for help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return 'I can help you with:\n• Matrix operations (addition, multiplication, etc.)\n• Matrix properties (determinant, rank, etc.)\n• Linear algebra concepts\n• Step-by-step explanations\n\nJust ask me anything about matrices!';
    }
    
    // Look for matrix knowledge
    const knowledge = findBestMatch(message);
    if (knowledge) {
      return knowledge;
    }
    
    // Check for calculation requests
    if (lowerMessage.includes('calculate') || lowerMessage.includes('solve') || lowerMessage.includes('find')) {
      return 'I can help explain matrix calculations! For actual computations, please use the Matrix Calculator tool above. I can explain the theory and steps involved in any operation you\'re working on.';
    }
    
    // Default response
    return 'I\'d love to help! Could you be more specific about what matrix concept or operation you\'d like to learn about? I can explain topics like matrix multiplication, determinants, eigenvalues, and much more!';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(inputMessage);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 pulse-glow floating-animation"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-50`}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className={`glass-effect ${isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'} transition-all duration-300`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-primary" />
              Matrix AI Assistant
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="flex flex-col h-[420px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className={`chat-bubble ${message.type}`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="h-3 w-3 text-secondary-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 justify-start"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <div className="chat-bubble assistant">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about matrices..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    size="icon"
                    className="pulse-glow"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default AIChatbot;
