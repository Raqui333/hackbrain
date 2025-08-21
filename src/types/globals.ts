type UserMessage = {
  id: string;
  type: 'user';
  content: string;
};

type BotMessage = {
  id: string;
  type: 'bot';
  content: string;
  error?: boolean;
  thinkingTime?: number;
};

type AgentMessage = UserMessage | BotMessage;
