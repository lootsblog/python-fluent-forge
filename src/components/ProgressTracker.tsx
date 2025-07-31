import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, CheckCircle, Clock } from 'lucide-react';

interface ProgressData {
  totalModules: number;
  completedModules: number;
  totalTasks: number;
  completedTasks: number;
  streak: number;
  badges: number;
}

interface ProgressTrackerProps {
  progress: ProgressData;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const overallProgress = (progress.completedTasks / progress.totalTasks) * 100;
  const moduleProgress = (progress.completedModules / progress.totalModules) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-python-blue/10 to-python-blue/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-python-blue" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {progress.completedTasks} of {progress.totalTasks} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-python-green/10 to-python-green/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-python-green" />
            Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{progress.completedModules}/{progress.totalModules}</div>
            <Progress value={moduleProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Modules completed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold flex items-center gap-1">
              {progress.streak}
              <span className="text-orange-500">🔥</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Day{progress.streak !== 1 ? 's' : ''} streak
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-python-yellow/10 to-python-yellow/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-python-yellow" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{progress.badges}</div>
            <p className="text-xs text-muted-foreground">
              Badges earned
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}