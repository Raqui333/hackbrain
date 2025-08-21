'use client';

import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';

export default function AIChat() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        <Chat />
      </div>
    </div>
  );
}
