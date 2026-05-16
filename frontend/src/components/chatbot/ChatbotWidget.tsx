'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  UserCircle,
  Bot,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useChatbotStore, type ChatMessage } from '@/stores/chatbot.store';

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MessageBubble({ message, onSuggestionClick }: { message: ChatMessage; onSuggestionClick?: (q: string) => void }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden">
        {isUser ? (
          <div className="w-full h-full bg-[#C4956A]/20 flex items-center justify-center">
            <UserCircle className="h-4 w-4 text-[#C4956A]" />
          </div>
        ) : isSystem ? (
          <div className="w-full h-full bg-amber-100 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
        ) : (
          <img src="/images/Agente_IA.png" alt="Zyla" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Bubble */}
      <div className="max-w-[75%] space-y-2">
        <div
          className={`rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
            isUser
              ? 'bg-[#1A1A1A] text-white rounded-br-sm'
              : isSystem
                ? 'bg-amber-50 text-stone-700 border border-amber-200 rounded-bl-sm'
                : 'bg-white text-stone-700 shadow-sm border border-stone-100 rounded-bl-sm'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {message.metadata?.ticketId && (
            <p className="mt-1 text-[11px] opacity-70">
              Ticket: #{message.metadata.ticketId}
            </p>
          )}
          <p
            className={`text-[10px] mt-1 ${
              isUser ? 'text-white/50' : 'text-stone-400'
            }`}
          >
            {formatTime(message.timestamp)}
          </p>
        </div>
        {/* Suggestion chips */}
        {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.metadata.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick?.(s)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#FAF8F5] text-[#C4956A] border border-[#C4956A]/20 hover:bg-[#C4956A]/10 transition-colors"
              >
                {s.length > 40 ? s.substring(0, 40) + '...' : s}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden">
        <img src="/images/Agente_IA.png" alt="Zyla" className="w-full h-full object-cover" />
      </div>
      <div className="bg-white shadow-sm border border-stone-100 rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-[#C4956A] rounded-full" />
        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-1.5 h-1.5 bg-[#C4956A] rounded-full" />
        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-1.5 h-1.5 bg-[#C4956A] rounded-full" />
      </div>
    </motion.div>
  );
}

export function ChatbotWidget() {
  const { isOpen, messages, isTyping, toggle, sendMessage, clearConversation, escalateToHuman } =
    useChatbotStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastMessageCountRef = useRef(messages.length);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-CO';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let silenceTimer: ReturnType<typeof setTimeout> | null = null;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);

        // Reset silence timer on each result
        if (silenceTimer) clearTimeout(silenceTimer);

        // If we have a final result, wait 1.5s of silence then send
        if (event.results[event.results.length - 1].isFinal) {
          silenceTimer = setTimeout(() => {
            const finalText = transcript.trim();
            if (finalText) {
              recognition.stop();
              setIsListening(false);
              setTimeout(() => {
                setInput('');
                sendMessage(finalText);
              }, 200);
            }
          }, 1500); // Wait 1.5 seconds of silence before sending
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [sendMessage]);

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CO';
    utterance.rate = 0.92;  // Slower pace for clarity and warmth
    utterance.pitch = 1.4;  // Higher pitch for young, fresh female voice
    utterance.volume = 1;

    // Try to find a Colombian/Latin Spanish female voice (warm, paisa-like)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang === 'es-CO' && v.name.toLowerCase().includes('female'))
      || voices.find(v => v.lang === 'es-CO')
      || voices.find(v => v.lang === 'es-MX' && v.name.toLowerCase().includes('female'))
      || voices.find(v => v.lang === 'es-MX')
      || voices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('female'))
      || voices.find(v => v.lang.startsWith('es') && !v.name.toLowerCase().includes('male'))
      || voices.find(v => v.lang.startsWith('es'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Speak assistant responses when voice is enabled
  useEffect(() => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    if (messages.length > lastMessageCountRef.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        speakText(lastMsg.content);
      }
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, voiceEnabled, speakText]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Stop any ongoing speech before listening
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const toggleVoice = useCallback(() => {
    if (voiceEnabled) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  }, [voiceEnabled]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Greet with voice when chat opens + focus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
      // Auto-greet with voice only if no messages yet
      if (messages.length === 0 && voiceEnabled) {
        setTimeout(() => {
          speakText('¡Hola! Soy Zyla, tu asistente personal de UrbanThread AI. ¿En qué puedo ayudarte hoy?');
        }, 500);
      }
    }
  }, [isOpen, messages.length, voiceEnabled, speakText]);

  // Handle close: stop audio and reset conversation
  const handleClose = useCallback(() => {
    // Stop any ongoing speech immediately
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    // Reset conversation
    clearConversation();
    setInput('');
    // Close the widget
    toggle();
  }, [clearConversation, toggle]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6" style={{ zIndex: 'var(--z-chatbot)' }}>
            {/* Pulsing ring 1 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              style={{ border: '2px solid #C4956A' }}
            />
            {/* Pulsing ring 2 (delayed) */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.4, 0, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
              style={{ border: '2px solid #D4A76A' }}
            />
            {/* Glow shadow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 8px rgba(196,149,106,0.3), 0 0 20px rgba(196,149,106,0.1)',
                  '0 0 20px rgba(196,149,106,0.6), 0 0 50px rgba(212,167,106,0.3)',
                  '0 0 8px rgba(196,149,106,0.3), 0 0 20px rgba(196,149,106,0.1)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Sparkle dot */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-[#C4956A] to-[#D4A76A]"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 8px rgba(196,149,106,0.8)' }}
            />
            {/* Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -4, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { type: 'spring', stiffness: 300, damping: 20 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileHover={{ scale: 1.12, y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggle}
              className="relative w-20 h-20 rounded-full overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-[#C4956A] focus:ring-offset-2"
              aria-label="Abrir chatbot"
            >
              <img
                src="/images/Agente_IA.png"
                alt="Asistente UrbanThread"
                className="w-full h-full object-cover"
              />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)]
              rounded-2xl shadow-glass overflow-hidden flex flex-col
              border border-ut-surface-dark bg-ut-surface
              mobile:w-[calc(100vw-1rem)] mobile:bottom-0 mobile:right-0 mobile:rounded-b-none mobile:h-[70vh]
              tablet:w-[360px] tablet:bottom-6 tablet:right-6 tablet:rounded-2xl tablet:h-[520px]"
            style={{ zIndex: 'var(--z-chatbot)' }}
            role="dialog"
            aria-label="Chatbot UrbanThread AI"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 text-white flex-shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #C4956A 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src="/images/Agente_IA.png" alt="Zyla" className="h-9 w-9 rounded-full object-cover border-2 border-white/30" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1A1A1A]" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight tracking-wide">
                    Zyla
                  </p>
                  <p className="text-[10px] text-white/60">Asistente UrbanThread AI · En línea</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearConversation}
                  className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                  aria-label="Limpiar conversación"
                  title="Limpiar conversación"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                  aria-label="Cerrar chatbot"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <img src="/images/Agente_IA.png" alt="Zyla" className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-[#C4956A]/30" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm font-bold text-stone-800">
                      ¡Hola! Soy Zyla 👋
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Tu asistente personal de UrbanThread AI.<br />
                      ¿En qué puedo ayudarte hoy?
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-2 mt-2"
                  >
                    {[
                      { label: '📦 Rastrear pedido', q: '¿Cómo rastreo mi pedido?' },
                      { label: '👗 Ver colecciones', q: '¿Qué colecciones tienen?' },
                      { label: '🔄 Devoluciones', q: '¿Cómo devuelvo un producto?' },
                      { label: '💳 Métodos de pago', q: '¿Qué métodos de pago aceptan?' },
                      { label: '🌿 Sostenibilidad', q: '¿Qué hacen por la sostenibilidad?' },
                      { label: '📞 Contacto', q: '¿Cómo los contacto?' },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => { setInput(''); sendMessage(chip.q); }}
                        className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-stone-600 border border-stone-200 hover:border-[#C4956A] hover:text-[#C4956A] hover:bg-[#C4956A]/5 transition-all duration-200"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </motion.div>
                </div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onSuggestionClick={(q) => { setInput(''); sendMessage(q); }} />
              ))}

              <AnimatePresence>
                {isTyping && <TypingIndicator />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Escalate button */}
            {messages.length > 2 && (
              <div className="px-4 pb-1">
                <button
                  onClick={escalateToHuman}
                  className="w-full text-[11px] text-ut-text-muted hover:text-ut-electric transition-colors py-1"
                >
                  ¿Necesitas hablar con un agente humano?
                </button>
              </div>
            )}

            {/* Input area */}
            <div className="flex flex-col gap-2 px-4 py-3 border-t border-stone-100 bg-white flex-shrink-0">
              {/* Voice controls */}
              <div className="flex items-center justify-between">
                <motion.button
                  onClick={toggleVoice}
                  animate={voiceEnabled ? {
                    boxShadow: [
                      '0 0 0px rgba(196,149,106,0.2)',
                      '0 0 10px rgba(196,149,106,0.6)',
                      '0 0 0px rgba(196,149,106,0.2)',
                    ],
                  } : {}}
                  transition={voiceEnabled ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                    voiceEnabled
                      ? 'bg-gradient-to-r from-[#C4956A]/15 to-[#D4A76A]/15 text-[#C4956A] border border-[#C4956A]/30'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                  title={voiceEnabled ? 'Desactivar respuestas por voz' : 'Activar respuestas por voz'}
                >
                  {voiceEnabled && (
                    <motion.span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  {voiceEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                  {voiceEnabled ? 'Voz activa' : 'Voz inactiva'}
                </motion.button>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 text-[10px] text-[#C4956A]"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-[#C4956A] rounded-full"
                    />
                    Zyla hablando...
                  </motion.div>
                )}
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2">
                {/* Mic button — corporate gold, animated, glowing */}
                <div className="relative">
                  {/* Glowing pulse ring when idle */}
                  {!isListening && (
                    <motion.div
                      className="absolute inset-[-3px] rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A76A]"
                      animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ filter: 'blur(4px)' }}
                    />
                  )}
                  {/* Sound wave rings when listening */}
                  {isListening && (
                    <>
                      <motion.div
                        className="absolute inset-[-5px] rounded-2xl border-2 border-red-400"
                        animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-[-5px] rounded-2xl border-2 border-red-300"
                        animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.88 }}
                    animate={isListening
                      ? { scale: [1, 1.1, 1] }
                      : { boxShadow: ['0 0 8px rgba(196,149,106,0.4)', '0 0 20px rgba(196,149,106,0.8)', '0 0 8px rgba(196,149,106,0.4)'] }
                    }
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    onClick={toggleListening}
                    disabled={isTyping}
                    className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                      isListening
                        ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-300/50'
                        : 'bg-gradient-to-br from-[#C4956A] to-[#1A1A1A] text-white shadow-lg shadow-[#C4956A]/40'
                    }`}
                    aria-label={isListening ? 'Detener grabación' : 'Hablar con Zyla'}
                    title={isListening ? 'Detener' : '🎤 Hablar con Zyla'}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </motion.button>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? 'Escuchando...' : 'Escríbele a Zyla...'}
                  disabled={isTyping}
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border bg-[#FAF8F5]
                    text-[13px] text-stone-700 placeholder:text-stone-400
                    focus:outline-none focus:ring-2 focus:ring-[#C4956A]/30 focus:border-[#C4956A]
                    disabled:opacity-50 transition-all ${
                      isListening ? 'border-red-300 bg-red-50/30' : 'border-stone-200'
                    }`}
                  aria-label="Mensaje para Zyla"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all shadow-sm hover:shadow-md"
                  style={{
                    background: !input.trim() || isTyping
                      ? '#d4d4d4'
                      : 'linear-gradient(135deg, #1A1A1A 0%, #C4956A 100%)',
                  }}
                  aria-label="Enviar mensaje"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatbotWidget;
