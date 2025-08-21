import { Brain, Circle, CircleX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { useEffect, useState } from 'react';
import { ms } from 'date-fns/locale';

interface ChatTextAreaProps {
  messages: AgentMessage[];
  loading: boolean;
}

export default function ChatTextArea({ messages, loading }: ChatTextAreaProps) {
  const [thinkingTime, setThinkingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (loading) {
      setThinkingTime(0);

      interval = setInterval(() => {
        setThinkingTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300"
          >
            {msg.type === 'user' ? (
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-br-sm max-w-4xl ml-auto">
                <p className="text-foreground break-words">{msg.content}</p>
              </div>
            ) : (
              <div className="p-4 max-w-4xl mr-auto">
                {msg.error ? (
                  <SystemMessage error={true} />
                ) : (
                  <SystemMessage content={String(msg.thinkingTime)} />
                )}
                <div className="text-foreground break-words CustomMarkdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{ code: CodeBlock }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain size={16} />
            <span className="text-muted-foreground animate-pulse">
              Pensando {thinkingTime + 's'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

type SystemMessageProps =
  | { error: true; content?: never }
  | { error?: false; content: string };

function SystemMessage({ content, error }: SystemMessageProps) {
  if (error)
    return (
      <div className="flex items-center gap-2 text-red-500 my-3">
        <CircleX size={16} />
        <span>Hmm... alguma coisa deu errado.</span>
      </div>
    );

  return (
    <div className="flex items-center gap-2 text-muted-foreground my-3">
      <Brain size={16} />
      <span>Pensado em {content + 's'}</span>
    </div>
  );
}

interface CodeProps {
  node?: any;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// Custom code block component for rendering code snippets in React Markdown
function CodeBlock({ node, className, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match?.[1] || 'plaintext';

  const isBlock = node?.children[0].position === undefined;

  if (isBlock) {
    return (
      <div className="overflow-hidden rounded-lg bg-white/10 text-gray-100 my-4">
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/10 text-xs text-gray-400 font-mono">
          <span>{lang}</span>
        </div>
        <pre className="overflow-x-auto text-sm p-2">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <code className="bg-white/20 rounded px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  );
}
