import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  module: {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
  };
  progress: number;
  onStart: () => void;
  completed?: boolean;
}

export function ModuleCard({ module, progress, onStart, completed = false }: ModuleCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'python-blue':
        return 'from-python-blue to-blue-600';
      case 'python-green':
        return 'from-python-green to-green-600';
      case 'python-yellow':
        return 'from-python-yellow to-yellow-600';
      default:
        return 'from-python-blue to-blue-600';
    }
  };

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      completed && "ring-2 ring-python-green/50"
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "text-3xl p-3 rounded-lg bg-gradient-to-br",
              getColorClasses(module.color),
              "text-white shadow-lg"
            )}>
              {module.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription className="mt-1">{module.description}</CardDescription>
            </div>
          </div>
          {completed && (
            <CheckCircle className="h-6 w-6 text-python-green" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant={completed ? "secondary" : "outline"} className="text-xs">
            Module {module.id}
          </Badge>
          <Button 
            onClick={onStart}
            variant={completed ? "secondary" : "default"}
            size="sm"
            className="group-hover:bg-python-blue group-hover:text-white transition-colors"
          >
            {completed ? "Review" : progress > 0 ? "Continue" : "Start"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}