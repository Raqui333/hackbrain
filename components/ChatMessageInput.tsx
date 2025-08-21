import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Dispatch, SetStateAction, useRef, useState } from 'react';

interface ChatInputProps {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<AgentMessage[]>>;
}

export default function ChatMessageInput({
  setLoading,
  setMessages,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const addMessage = (
    message: Omit<UserMessage, 'id'> | Omit<BotMessage, 'id'>
  ) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: (prev.length + 1).toString() },
    ]);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    textAreaRef.current?.blur();

    addMessage({ type: 'user', content: message });
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error('Erro ao enviar mensagem');
      }

      const data = await response.json();

      addMessage({
        type: 'bot',
        content: data.text,
        thinkingTime: data.thinkingTime,
        error: false,
      });
    } catch (error) {
      addMessage({
        type: 'bot',
        content:
          'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        error: true,
        thinkingTime: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/4 border-white/10 w-full max-w-4xl mx-auto my-10 p-4 gap-0">
      <CardContent className="p-0">
        <div className="flex items-center gap-2">
          <Textarea
            ref={textAreaRef}
            placeholder="Digite sua pergunta ou peça uma explicação..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none border-0 !bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/70 CustomScrollbar p-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButtonRef.current?.click();
              }
            }}
          />
          <Button
            ref={sendButtonRef}
            disabled={!message.trim()}
            className="h-8 w-8 text-gray-700 bg-white hover:bg-white/80 disabled:bg-white/20 disabled:border-1 border-white/20 disabled:text-white/50"
            onClick={handleSubmit}
          >
            <ArrowUp />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
