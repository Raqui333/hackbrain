import { Brain, Sparkles } from 'lucide-react';

interface LogoProps {
  variant: 'large' | 'small';
}

export default function Logo({ variant }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      {variant === 'large' ? (
        <>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
            <Brain className="relative h-16 w-16 text-blue-400" />
            <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-blue-300 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Brain Hack
          </h1>
        </>
      ) : (
        <>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
            <Brain className="relative h-8 w-8 text-blue-400" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-blue-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Brain Hack
            </h1>
            <p className="text-xs text-muted-foreground">Seu Segundo Cérebro</p>
          </div>
        </>
      )}
    </div>
  );
}
