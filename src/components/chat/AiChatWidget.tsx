import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, ChevronDown, ChevronUp, Loader2, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { chatService } from '../../services/ai/chatService';
import type { ChatMessage } from '../../services/ai/chatService';

export const AiChatWidget: React.FC = () => {
  const { user } = useAuth();
  const { activeTrip } = useTrips();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || !user || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const responseMsg = await chatService.sendMessage(user.id, activeTrip?.id, query);
      setMessages(prev => [...prev, responseMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I couldn\'t access the information needed to answer that right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSourceExpand = (msgId: string) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const suggestedQuestions = [
    'Summarize my active trip',
    'What am I doing on Day 2?',
    'Am I over my budget?',
    'How much am I spending in Paris?'
  ];

  if (!user) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, pointerEvents: 'auto' }}>
      
      {/* Collapsed State Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--bg-card), var(--bg-subtle))',
            color: 'var(--text-primary)',
            border: '1.5px solid var(--primary)',
            boxShadow: '0 8px 24px rgba(184, 111, 82, 0.25)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
            transition: 'all 0.25 ease'
          }}
          className="animate-fade-in"
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={16} />
          </div>
          <span>Ask GlobeTrotter AI</span>
        </button>
      )}

      {/* Expanded Floating Chat Panel */}
      {isOpen && (
        <div style={{
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '540px',
          maxHeight: 'calc(100vh - 100px)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 40px -10px rgba(31, 26, 23, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }} className="animate-fade-in">

          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-subtle)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
                  GlobeTrotter AI Assistant
                </h3>
                <span style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 600 }}>
                  {activeTrip ? `Helping with: ${activeTrip.name}` : 'Context-Aware RAG Assistant'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages Conversation Area */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--bg-card)'
          }}>

            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  👋 Hi {user.name.split(' ')[0]}! I'm your RAG-powered travel assistant. Ask me questions grounded directly in your trip itinerary and budget.
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Suggested Questions:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      style={{
                        textAlign: 'left',
                        padding: '0.6rem 0.85rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.3rem'
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)'
                }}>
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                  {/* Hackathon Expandable Source Data Breakdown */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px stroke rgba(0,0,0,0.1)' }}>
                      <button
                        type="button"
                        onClick={() => toggleSourceExpand(msg.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: msg.sender === 'user' ? '#FFFFFF' : 'var(--primary)',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          padding: 0
                        }}
                      >
                        <Compass size={12} />
                        <span>Based on your trip data ({msg.sources.length} sources)</span>
                        {expandedSources[msg.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>

                      {expandedSources[msg.id] && (
                        <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.7rem', opacity: 0.9 }}>
                          {msg.sources.map((s, idx) => (
                            <div key={idx} style={{ background: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                              <strong>{s.title}</strong> • {s.detail}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', color: 'var(--primary)', fontSize: '0.8rem' }}>
                <Loader2 size={16} className="animate-spin" />
                <span>Retrieving user trip context & generating grounded answer...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Footer Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '0.85rem 1rem',
              background: 'var(--bg-subtle)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              className="input-field"
              placeholder="Ask about your trip, itinerary, or budget..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              disabled={isLoading}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="btn btn-primary btn-sm"
              style={{ height: '38px', padding: '0 0.85rem', flexShrink: 0 }}
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
