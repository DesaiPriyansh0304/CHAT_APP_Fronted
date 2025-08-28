import React, { useState, useRef, useEffect } from 'react';

const DraggableChatbot = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! How can I help you today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const chatbotRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle mouse down for dragging
    const handleMouseDown = (e) => {
        if (e.target.closest('.chat-input') || e.target.closest('.chat-messages')) return;

        setIsDragging(true);
        const rect = chatbotRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // Handle mouse move for dragging
    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Keep chatbot within viewport
        const maxX = window.innerWidth - 350;
        const maxY = window.innerHeight - (isOpen ? 500 : 60);

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    };

    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 500); // thodu delay, jyathi DOM ready thay
        }
    }, [isOpen]);

    // Add event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    // Send message to your backend API
    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();

        // Check message length (same as backend validation)
        if (userMessage.length > 1000) {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: 'Message too long. Maximum 1000 characters allowed.'
            }]);
            return;
        }

        setInputMessage('');

        // Add user message to chat
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            console.log('📤 Sending message to backend:', userMessage);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP}/api/chat/bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            console.log('📡 Response status:', response.status);

            const data = await response.json();
            console.log('📥 Backend response:', data);

            if (response.ok && data.success && data.data && data.data.botResponse) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: data.data.botResponse,
                    timestamp: data.data.timestamp
                }]);
            } else {
                // Handle backend error response
                const errorMessage = data.error || data.data?.botResponse || 'Sorry, I encountered an error. Please try again.';
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: errorMessage
                }]);
            }
        } catch (error) {
            console.log('❌ Error sending message:', error);

            // Handle different types of errors
            let errorMessage = 'Sorry, I could not connect to the server. Please check your internet connection.';

            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message.includes('NetworkError')) {
                errorMessage = 'Network connection failed. Please try again.';
            }

            setMessages(prev => [...prev, {
                type: 'bot',
                text: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Handle clear chat
    const clearChat = () => {
        setMessages([
            { type: 'bot', text: 'Hello! How can I help you today?' }
        ]);
    };

    return (
        <div
            ref={chatbotRef}
            className={`fixed z-50 transition-all duration-300 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: isOpen ? '400px' : '60px',
                height: isOpen ? '500px' : '60px'
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Chatbot Button */}
            {!isOpen && (
                <div
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                    title="Open AI Assistant"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-full h-full bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center">
                                <img src="https://static.vecteezy.com/system/resources/thumbnails/030/855/959/small/a-man-stands-on-the-beach-at-sunset-ai-generated-photo.jpg" alt="" className='w-8 h-8 rounded-full' />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">AI Assistant</h3>
                                <p className="text-xs opacity-90">
                                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearChat();
                                }}
                                className="text-white hover:text-gray-200 transition-colors"
                                title="Clear Chat"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                                className="text-white hover:text-gray-200 transition-colors"
                                title="Close Chat"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-messages bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-2xl ${message.type === 'user'
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 shadow-sm rounded-bl-none border'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                    {message.timestamp && (
                                        <p className={`text-[13px] mt-1 opacity-70 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-sm border">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t chat-input">
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                maxLength={1000}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    sendMessage();
                                }}
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity  disabled:cursor-not-allowed"
                                title="Send Message"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {/* <div className="text-xs text-gray-500 mt-1">
                            {inputMessage.length}/1000 characters
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DraggableChatbot;