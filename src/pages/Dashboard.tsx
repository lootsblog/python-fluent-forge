import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '@/components/ModuleCard';
import { ProgressTracker } from '@/components/ProgressTracker';
import { AchievementBadge } from '@/components/AchievementBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Target, Zap } from 'lucide-react';
import modulesData from '@/data/modules.json';

interface UserProgress {
  completedModules: number[];
  completedTasks: string[];
  earnedAchievements: string[];
  streak: number;
  lastActivity: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedModules: [],
    completedTasks: [],
    earnedAchievements: [],
    streak: 1,
    lastActivity: new Date().toDateString()
  });

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('pythonLearningProgress');
    if (saved) {
      setUserProgress(JSON.parse(saved));
    }
  }, []);

  const getModuleProgress = (moduleId: number) => {
    const module = modulesData.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const totalTasks = module.lessons.reduce((acc, lesson) => acc + lesson.tasks.length, 0) + 1; // +1 for project
    const completedTasks = userProgress.completedTasks.filter(taskId => 
      taskId.startsWith(`${moduleId}-`)
    ).length;
    
    return (completedTasks / totalTasks) * 100;
  };

  const progressData = {
    totalModules: modulesData.modules.length,
    completedModules: userProgress.completedModules.length,
    totalTasks: modulesData.modules.reduce((acc, module) => 
      acc + module.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.tasks.length, 0) + 1, 0
    ),
    completedTasks: userProgress.completedTasks.length,
    streak: userProgress.streak,
    badges: userProgress.earnedAchievements.length
  };

  const handleStartModule = (moduleId: number) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-python-blue/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-python-blue to-python-green bg-clip-text text-transparent">
            🐍 Python Fluency Academy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master Python through hands-on practice with real-world scripting and AI applications
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <BookOpen className="h-4 w-4 mr-1" />
              5 Modules
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Target className="h-4 w-4 mr-1" />
              50+ Exercises
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Zap className="h-4 w-4 mr-1" />
              Live Code Execution
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <ProgressTracker progress={progressData} />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-python-blue to-python-green text-white">
            <BookOpen className="mr-2 h-5 w-5" />
            Continue Learning
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/playground')}
          >
            🖥️ Python Playground
          </Button>
          <Button variant="outline" size="lg">
            <Trophy className="mr-2 h-5 w-5" />
            View Achievements
          </Button>
        </div>

        {/* Modules Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulesData.modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={getModuleProgress(module.id)}
                onStart={() => handleStartModule(module.id)}
                completed={userProgress.completedModules.includes(module.id)}
              />
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {modulesData.achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                earned={userProgress.earnedAchievements.includes(achievement.id)}
              />
            ))}
          </div>
        </div>

        {/* Challenges Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Bonus Challenges
              <Badge variant="outline">Coming Soon</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modulesData.challenges.slice(0, 3).map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-semibold mb-2">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {challenge.difficulty}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}