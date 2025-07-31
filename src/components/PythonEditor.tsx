import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    pyodide: any;
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
    // Load Pyodide dynamically
    const loadPyodide = async () => {
      if (window.pyodide) {
        console.log('Pyodide already loaded');
        return;
      }
      
      console.log('Loading Pyodide...');
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = async () => {
          console.log('Pyodide script loaded, initializing...');
          try {
            window.pyodide = await (window as any).loadPyodide();
            console.log('Pyodide ready!');
          } catch (err) {
            console.error('Failed to initialize Pyodide:', err);
          }
        };
        script.onerror = () => {
          console.error('Failed to load Pyodide script');
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error('Error loading Pyodide:', err);
      }
    };

    loadPyodide();
  }, []);

  const runCode = async () => {
    console.log('Pyodide available:', !!window.pyodide, 'isRunning:', isRunning);
    if (!window.pyodide || isRunning) {
      if (!window.pyodide) {
        setOutput('Error: Python interpreter is still loading. Please wait a moment and try again.');
      }
      return;
    }
    
    setIsRunning(true);
    setOutput('');

    try {
      // Capture stdout
      const result = window.pyodide.runPython(`
import sys
from io import StringIO

# Capture stdout
old_stdout = sys.stdout
sys.stdout = StringIO()

try:
${code.split('\n').map(line => `    ${line}`).join('\n')}
    
    output = sys.stdout.getvalue()
    sys.stdout = old_stdout
    output
except Exception as e:
    sys.stdout = old_stdout
    raise e
      `);
      
      setOutput(result || 'Code executed successfully (no output)');
      onRun?.(result);
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