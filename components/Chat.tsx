import { useEffect, useRef, useState } from 'react';

import ChatTextArea from './ChatTextArea';
import ChatMessageInput from './ChatMessageInput';
import Logo from './Logo';

export default function Chat() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-center h-screen overflow-hidden">
      {messages.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto CustomScrollbar transition-opacity duration-300 ease-in-out"
        >
          <ChatTextArea messages={messages} loading={loading} />
        </div>
      ) : (
        <div className="flex items-center justify-center my-5">
          <Logo variant="large" />
        </div>
      )}

      <div className={loading ? 'pointer-events-none opacity-50' : ''}>
        <ChatMessageInput setLoading={setLoading} setMessages={setMessages} />
      </div>
    </div>
  );
}
