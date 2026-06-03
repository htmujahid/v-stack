'use client';

import * as React from 'react';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { cn } from '@/lib/utils';

interface DataTableSearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function DataTableSearchInput({
  value,
  onValueChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
}: DataTableSearchInputProps) {
  const [input, setInput] = React.useState(value);

  React.useEffect(() => {
    setInput(value);
  }, [value]);

  const commit = useDebouncedCallback(
    (next: string) => onValueChange(next),
    debounceMs,
  );

  return (
    <div className={cn('relative w-full sm:max-w-xs', className)}>
      <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        placeholder={placeholder}
        value={input}
        onChange={(e) => {
          const next = e.target.value;
          setInput(next);
          commit(next);
        }}
        className="pl-8"
      />
    </div>
  );
}
