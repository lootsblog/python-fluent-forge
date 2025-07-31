import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  className?: string;
}

export function AchievementBadge({ achievement, earned = false, className }: AchievementBadgeProps) {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      earned 
        ? "bg-gradient-to-br from-python-yellow/20 to-python-yellow/10 border-python-yellow/30 shadow-lg" 
        : "bg-muted/30 opacity-60",
      className
    )}>
      <CardContent className="p-4 text-center">
        <div className={cn(
          "text-3xl mb-2 transition-all duration-300",
          earned ? "animate-pulse" : "grayscale"
        )}>
          {achievement.icon}
        </div>
        <h3 className={cn(
          "font-semibold text-sm mb-1",
          earned ? "text-foreground" : "text-muted-foreground"
        )}>
          {achievement.title}
        </h3>
        <p className={cn(
          "text-xs",
          earned ? "text-muted-foreground" : "text-muted-foreground/70"
        )}>
          {achievement.description}
        </p>
        {earned && (
          <Badge className="mt-2 bg-python-yellow text-python-dark text-xs">
            Earned! 🎉
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}