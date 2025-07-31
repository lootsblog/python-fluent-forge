import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PythonEditor } from '@/components/PythonEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  BookOpen, 
  Code, 
  Trophy,
  Lightbulb
} from 'lucide-react';
import modulesData from '@/data/modules.json';
import { cn } from '@/lib/utils';

export default function ModuleView() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showProject, setShowProject] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const module = modulesData.modules.find(m => m.id === parseInt(moduleId || '1'));

  useEffect(() => {
    // Load completed tasks from localStorage
    const saved = localStorage.getItem('pythonLearningProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedTasks(progress.completedTasks || []);
    }
  }, []);

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module not found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentLesson = module.lessons[currentLessonIndex];
  const currentTask = currentLesson?.tasks[currentTaskIndex];
  const totalTasks = module.lessons.reduce((acc, lesson) => acc + lesson.tasks.length, 0);
  const completedModuleTasks = completedTasks.filter(taskId => 
    taskId.startsWith(`${module.id}-`)
  ).length;
  const progressPercentage = (completedModuleTasks / (totalTasks + 1)) * 100; // +1 for project

  const markTaskCompleted = (taskId: string) => {
    if (completedTasks.includes(taskId)) return;
    
    const newCompletedTasks = [...completedTasks, taskId];
    setCompletedTasks(newCompletedTasks);
    
    // Save to localStorage
    const saved = localStorage.getItem('pythonLearningProgress') || '{}';
    const progress = JSON.parse(saved);
    progress.completedTasks = newCompletedTasks;
    localStorage.setItem('pythonLearningProgress', JSON.stringify(progress));
  };

  const nextTask = () => {
    if (currentTaskIndex < currentLesson.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else if (currentLessonIndex < module.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentTaskIndex(0);
    } else {
      setShowProject(true);
    }
  };

  const prevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    } else if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentTaskIndex(module.lessons[currentLessonIndex - 1].tasks.length - 1);
    }
  };

  const isTaskCompleted = (taskId: string) => completedTasks.includes(taskId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-python-blue/5">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">{module.icon}</span>
              {module.title}
            </h1>
            <p className="text-muted-foreground">{module.description}</p>
          </div>
          <div className="w-[120px]"> {/* Spacer for centering */}</div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Module Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedModuleTasks} of {totalTasks + 1} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {!showProject ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lesson Content */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {currentLesson.title}
                    <Badge variant="outline">
                      Lesson {currentLessonIndex + 1} of {module.lessons.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Theory
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentLesson.theory}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Example Code:</h4>
                    <PythonEditor
                      initialCode={currentLesson.example}
                      height="200px"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Task Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Practice Tasks
                    </span>
                    <Badge variant="outline">
                      {currentTaskIndex + 1} of {currentLesson.tasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    {currentLesson.tasks.map((task, index) => (
                      <Button
                        key={task.id}
                        variant={index === currentTaskIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentTaskIndex(index)}
                        className={cn(
                          "relative",
                          isTaskCompleted(task.id) && "ring-2 ring-python-green/50"
                        )}
                      >
                        Task {index + 1}
                        {isTaskCompleted(task.id) && (
                          <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-python-green bg-background rounded-full" />
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm">{currentTask?.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Code Editor */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Practice: {currentTask?.description}</span>
                    {isTaskCompleted(currentTask?.id || '') && (
                      <CheckCircle className="h-5 w-5 text-python-green" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="practice" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="practice">Practice</TabsTrigger>
                      <TabsTrigger value="solution">Solution</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="practice">
                      <PythonEditor
                        initialCode={currentTask?.starter_code || ''}
                        onRun={() => markTaskCompleted(currentTask?.id || '')}
                        height="400px"
                      />
                    </TabsContent>
                    
                    <TabsContent value="solution">
                      <PythonEditor
                        initialCode={currentTask?.solution || ''}
                        height="400px"
                        readOnly
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevTask}
                  disabled={currentLessonIndex === 0 && currentTaskIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                <Button 
                  onClick={nextTask}
                  className="bg-gradient-to-r from-python-blue to-python-green text-white"
                >
                  {currentLessonIndex === module.lessons.length - 1 && 
                   currentTaskIndex === currentLesson.tasks.length - 1 
                    ? "Start Project" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Project View */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-python-yellow" />
                  Final Project: {module.project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {module.project.description}
                </p>
                
                <Tabs defaultValue="project" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="project">Your Solution</TabsTrigger>
                    <TabsTrigger value="reference">Reference Solution</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="project">
                    <PythonEditor
                      initialCode={module.project.starter_code}
                      height="500px"
                    />
                  </TabsContent>
                  
                  <TabsContent value="reference">
                    <PythonEditor
                      initialCode={module.project.solution}
                      height="500px"
                      readOnly
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowProject(false)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Lessons
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-python-green to-python-blue text-white"
              >
                Complete Module
                <Trophy className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}