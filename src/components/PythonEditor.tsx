import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    Sk: any;
  }
}

interface PythonEditorProps {
  initialCode?: string;
  onRun?: (output: string) => void;
  height?: string;
  readOnly?: boolean;
}

export function PythonEditor({ 
  initialCode = "# Write your Python code here\nprint('Hello, Python!')", 
  onRun,
  height = "300px",
  readOnly = false 
}: PythonEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load Skulpt dynamically
    const loadSkulpt = () => {
      if (window.Sk) {
        console.log('Skulpt already loaded');
        return;
      }
      
      console.log('Loading Skulpt...');
      const script1 = document.createElement('script');
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/skulpt/0.11.1/skulpt.min.js';
      script1.onload = () => {
        console.log('Skulpt main script loaded');
        const script2 = document.createElement('script');
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/skulpt/0.11.1/skulpt-stdlib.js';
        script2.onload = () => {
          console.log('Skulpt stdlib loaded, Python ready!');
        };
        script2.onerror = () => {
          console.error('Failed to load Skulpt stdlib');
        };
        document.head.appendChild(script2);
      };
      script1.onerror = () => {
        console.error('Failed to load Skulpt main script');
      };
      
      document.head.appendChild(script1);
    };

    loadSkulpt();
  }, []);

  const runCode = async () => {
    console.log('Skulpt available:', !!window.Sk, 'isRunning:', isRunning);
    if (!window.Sk || isRunning) {
      if (!window.Sk) {
        setOutput('Error: Python interpreter is still loading. Please wait a moment and try again.');
      }
      return;
    }
    
    setIsRunning(true);
    setOutput('');

    try {
      let outputText = '';
      
      window.Sk.configure({
        output: (text: string) => {
          outputText += text;
        },
        read: (x: string) => {
          if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
          return window.Sk.builtinFiles["files"][x];
        }
      });

      await window.Sk.misceval.asyncToPromise(() => {
        return window.Sk.importMainWithBody("<stdin>", false, code, true);
      });

      setOutput(outputText || 'Code executed successfully (no output)');
      onRun?.(outputText);
    } catch (err: any) {
      const errorMsg = err.toString();
      setOutput(`Error: ${errorMsg}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      
      setCode(newCode);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-medium">Python Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="h-8 px-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCode}
              className="h-8 px-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={runCode}
              disabled={isRunning}
              size="sm"
              className="h-8 px-3 bg-gradient-to-r from-python-blue to-python-green text-white"
            >
              {isRunning ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full p-4 bg-code-bg text-green-400 font-mono text-sm resize-none border-0 focus:outline-none",
              "placeholder:text-green-400/50"
            )}
            style={{ height }}
            placeholder="# Write your Python code here..."
            spellCheck={false}
            readOnly={readOnly}
          />
        </div>
      </Card>

      {output && (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
            <span className="text-sm font-medium">Output</span>
          </div>
          <pre className={cn(
            "p-4 text-sm font-mono whitespace-pre-wrap bg-background",
            output.startsWith('Error:') ? 'text-red-600' : 'text-foreground'
          )}>
            {output}
          </pre>
        </Card>
      )}
    </div>
  );
}