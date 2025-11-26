
import React from 'react';
import { Message } from '../types';
import { styles } from '../constants';

interface ChatSectionProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSendMessage: () => void;
  isChatLoading: boolean;
  messagesBoxRef: React.RefObject<HTMLDivElement>;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  inputValue,
  setInputValue,
  handleSendMessage,
  isChatLoading,
  messagesBoxRef
}) => {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={styles.chatSection}>
      <div ref={messagesBoxRef} style={styles.messagesBox}>
        {messages.map((msg, idx) => (
          <div key={idx} style={styles.bubble(msg.role === 'user')}>
            {msg.text}
          </div>
        ))}
        {isChatLoading && (
          <div style={{...styles.bubble(false), opacity: 0.7}}>
            <em>AI pisze...</em>
          </div>
        )}
      </div>

      <div style={styles.inputWrapper}>
        <textarea
          style={styles.input}
          placeholder="Opisz zlecenie (np. witryna 2x3m, folia OWV)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isChatLoading}
        />
        <button 
          style={{...styles.sendBtn, opacity: isChatLoading ? 0.5 : 1}} 
          onClick={handleSendMessage}
          disabled={isChatLoading}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
};
