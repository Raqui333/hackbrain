import {
  Brain,
  FileText,
  Plus,
  Search,
  Settings,
  Sparkles,
  Upload,
  User,
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import Logo from './Logo';

const styleSelected =
  'w-full justify-start gap-3 h-12 text-left bg-blue-500/10 text-blue-400 hover:text-white border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30';

const styleDefault =
  'w-full justify-start gap-3 h-12 text-left hover:bg-white/5 hover:text-blue-400';

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/95 border-r border-white/20 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-white/10">
          <Logo variant="small" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className={styleSelected}>
            <Brain className="h-5 w-5" />
            Chat com IA
          </Button>
          <Button variant="ghost" className={styleDefault}>
            <FileText className="h-5 w-5" />
            Base de Conhecimento
          </Button>
          <Button variant="ghost" className={styleDefault}>
            <Settings className="h-5 w-5" />
            Configurações
          </Button>
        </nav>

        <div className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-3 h-12">
            <User className="relative h-5 w-5 text-white" />

            <div className="text-left">
              <p className="text-sm text-white font-medium">João Silva</p>
              <p className="text-xs text-muted-foreground">joao@email.com</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
