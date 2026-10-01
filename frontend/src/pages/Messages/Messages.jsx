import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, User, MessageSquare, Clock, CheckCheck, Sparkles } from 'lucide-react';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../store/authStore';
import { useNotification } from '../../store/notificationStore';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';

export const Messages = () => {
  const { user } = useAuth();
  const { socket } = useNotification();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom of message thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, partnerTyping]);

  // Load conversations on mount
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const res = await messageService.getConversations();
        setConversations(res.conversations || []);

        // If navigated with target conversation state
        if (location.state?.conversationId) {
          const matched = res.conversations?.find((c) => c._id === location.state.conversationId);
          if (matched) setActiveConversation(matched);
        } else if (res.conversations?.length > 0) {
          setActiveConversation(res.conversations[0]);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConvs();
  }, [location.state]);

  // Load messages whenever activeConversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMsgs = async () => {
      try {
        const res = await messageService.getMessages(activeConversation._id);
        setMessages(res.messages || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMsgs();

    // Join Socket conversation room
    if (socket) {
      socket.emit('join_conversation', { conversationId: activeConversation._id });
    }

    return () => {
      if (socket) {
        socket.emit('leave_conversation', { conversationId: activeConversation._id });
      }
    };
  }, [activeConversation?._id, socket]);

  // Socket event listeners for real-time messages & typing
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      if (activeConversation && newMsg.conversationId === activeConversation._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
      // Update snippet in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c._id === newMsg.conversationId
            ? { ...c, lastMessage: newMsg.message, lastMessageAt: new Date() }
            : c
        )
      );
    };

    const handleUserTyping = (data) => {
      if (data.userId !== user?._id) {
        setPartnerTyping(data.isTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, activeConversation?._id, user?._id]);

  // Handle typing indicator
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socket && activeConversation) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing_start', {
          conversationId: activeConversation._id,
          userName: user?.name,
        });
      }

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing_stop', {
          conversationId: activeConversation._id,
        });
      }, 1500);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const partner = activeConversation.participants?.find((p) => p._id !== user?._id);
    const textToSend = inputText.trim();
    setInputText('');

    if (socket && partner) {
      socket.emit('send_message', {
        conversationId: activeConversation._id,
        receiverId: partner._id,
        message: textToSend,
      });
    } else {
      // Fallback to HTTP
      try {
        const res = await messageService.sendMessage({
          conversationId: activeConversation._id,
          receiverId: partner._id,
          message: textToSend,
        });
        setMessages((prev) => [...prev, res.message]);
      } catch (err) {
        alert('Failed to send message.');
      }
    }
  };

  if (loading) return <Loader fullScreen message="Loading real-time chat..." />;

  const getPartner = (conv) =>
    conv.participants?.find((p) => p._id !== user?._id) || { name: 'User' };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden h-[75vh] flex">
      {/* Left Column: Conversations List */}
      <div className="w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            Messages
          </h2>
          <span className="text-2xs text-slate-400">Real-time WebSocket Chat</span>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No conversations yet. Visit a project or freelancer profile to start a chat.
            </div>
          ) : (
            conversations.map((conv) => {
              const partner = getPartner(conv);
              const isSelected = activeConversation?._id === conv._id;
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-4 text-left transition flex items-start gap-3 ${
                    isSelected ? 'bg-white shadow-xs border-l-4 border-brand-600' : 'hover:bg-white'
                  }`}
                >
                  <img
                    src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={partner.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{partner.name}</h4>
                      <span className="text-3xs text-slate-400">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span className="text-2xs text-brand-600 block truncate font-medium">
                      {partner.role}
                    </span>
                    <p className="text-2xs text-slate-500 truncate mt-0.5">
                      {conv.lastMessage || 'Started conversation'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Chat History & Input */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <img
                src={getPartner(activeConversation).avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={getPartner(activeConversation).name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {getPartner(activeConversation).name}
                </h3>
                <span className="text-2xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Online
                </span>
              </div>
            </div>

            {activeConversation.projectId && (
              <span className="text-2xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                Ref: {activeConversation.projectId.title}
              </span>
            )}
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.map((msg, idx) => {
              const isMine = (msg.senderId?._id || msg.senderId) === user?._id;
              return (
                <div
                  key={msg._id || idx}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMine
                        ? 'bg-brand-600 text-white rounded-br-2xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-2xs'
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                  <span className="text-3xs text-slate-400 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })}

            {partnerTyping && (
              <div className="flex items-center gap-2 text-2xs text-slate-400 italic">
                <span className="animate-pulse">
                  {getPartner(activeConversation).name} is typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              placeholder="Type your message here..."
              value={inputText}
              onChange={handleInputChange}
              className="flex-1 px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button type="submit" size="sm" variant="primary">
              <Send className="w-4 h-4 mr-1" /> Send
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
          <p className="text-sm font-semibold">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};
