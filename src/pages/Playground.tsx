import React, { useState } from 'react';
import { PythonEditor } from '@/components/PythonEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const examples = [
  {
    title: "Hello Python",
    code: `# Welcome to Python!
print("Hello, Python World!")

# Variables and types
name = "Python Learner"
age = 25
is_learning = True

print(f"My name is {name}, I'm {age} years old")
print(f"Am I learning Python? {is_learning}")

# Lists and loops
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}s")`
  },
  {
    title: "Data Structures",
    code: `# Python data structures in action
from collections import Counter

# Dictionary example
student = {
    "name": "Alice",
    "grades": [85, 92, 78, 96],
    "subjects": ["Math", "Science", "English", "History"]
}

# Calculate average grade
average = sum(student["grades"]) / len(student["grades"])
print(f"{student['name']}'s average grade: {average:.1f}")

# List comprehension
high_grades = [grade for grade in student["grades"] if grade >= 90]
print(f"High grades (90+): {high_grades}")

# Counter example
text = "python programming is fun and python is powerful"
word_count = Counter(text.split())
print("Word frequencies:", word_count.most_common(3))`
  },
  {
    title: "Web API Example",
    code: `# Simulated API request (using mock data)
import json
from datetime import datetime

# Mock API response
def mock_api_call():
    return {
        "status": "success",
        "data": {
            "weather": "sunny",
            "temperature": 75,
            "location": "Python City",
            "timestamp": str(datetime.now())
        }
    }

# Process API response
response = mock_api_call()
print("API Response:")
print(json.dumps(response, indent=2))

if response["status"] == "success":
    data = response["data"]
    print(f"Weather in {data['location']}: {data['weather']}")
    print(f"Temperature: {data['temperature']}°F")
    print(f"Last updated: {data['timestamp']}")
else:
    print("API request failed")`
  },
  {
    title: "File Processing",
    code: `# File processing simulation
import csv
from io import StringIO

# Create sample CSV data
csv_data = """name,age,city,salary
Alice,25,New York,75000
Bob,30,San Francisco,85000
Charlie,35,Chicago,70000
Diana,28,Boston,80000"""

# Process CSV data
employees = []

# Read CSV (simulated)
lines = csv_data.strip().split('\\n')
headers = lines[0].split(',')
for line in lines[1:]:
    values = line.split(',')
    employee = dict(zip(headers, values))
    employee['age'] = int(employee['age'])
    employee['salary'] = int(employee['salary'])
    employees.append(employee)

# Analysis
print("Employee Analysis:")
print(f"Total employees: {len(employees)}")

avg_age = sum(emp['age'] for emp in employees) / len(employees)
avg_salary = sum(emp['salary'] for emp in employees) / len(employees)

print(f"Average age: {avg_age:.1f}")
print(f"Average salary: $" + f"{avg_salary:,.2f}")

# High earners
high_earners = [emp for emp in employees if emp['salary'] > 75000]
print(f"High earners (>$75k): {len(high_earners)}")
for emp in high_earners:
    print(f"  {emp['name']} - $" + f"{emp['salary']:,}")`
  }
];

export default function Playground() {
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState(0);
  const [code, setCode] = useState(examples[0].code);

  const loadExample = (index: number) => {
    setSelectedExample(index);
    setCode(examples[index].code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-python-green/5">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-python-blue to-python-green bg-clip-text text-transparent">
              🐍 Python Playground
            </h1>
            <p className="text-muted-foreground">Experiment with Python code in real-time</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Examples Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Scripts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant={selectedExample === index ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => loadExample(index)}
                  >
                    {example.title}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <strong>💡 Tab Completion:</strong> Press Tab to indent code
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <strong>🚀 Run Code:</strong> Click Run button to execute
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <strong>🔄 Reset:</strong> Click reset button to restore original code
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <strong>📋 Copy:</strong> Use copy button to save your code
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🖥️ Code Editor
                    <Badge variant="outline">{examples[selectedExample].title}</Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Python 3.x
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Live Execution
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PythonEditor
                  initialCode={code}
                  height="600px"
                  onRun={(output) => {
                    console.log('Code executed:', output);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Python Reference */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Quick Python Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">Data Types</h4>
                <div className="text-xs bg-muted p-2 rounded font-mono">
                  <div>str = "Hello"</div>
                  <div>int = 42</div>
                  <div>float = 3.14</div>
                  <div>bool = True</div>
                  <div>list = [1, 2, 3]</div>
                  <div>dict = {"{"}key: value{"}"}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Control Flow</h4>
                <div className="text-xs bg-muted p-2 rounded font-mono">
                  <div>if x &gt; 0:</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;print("positive")</div>
                  <div>elif x == 0:</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;print("zero")</div>
                  <div>else:</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;print("negative")</div>
                  <div>&nbsp;</div>
                  <div>for i in range(5):</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;print(i)</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Functions</h4>
                <div className="text-xs bg-muted p-2 rounded font-mono">
                  <div>def greet(name):</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;return f"Hello, {'{name}'}!"</div>
                  <div>&nbsp;</div>
                  <div># Lambda function</div>
                  <div>square = lambda x: x**2</div>
                  <div>&nbsp;</div>
                  <div># Default parameters</div>
                  <div>def power(x, exp=2):</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;return x ** exp</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">List Comprehensions</h4>
                <div className="text-xs bg-muted p-2 rounded font-mono">
                  <div># Basic comprehension</div>
                  <div>squares = [x**2 for x in range(10)]</div>
                  <div>&nbsp;</div>
                  <div># With condition</div>
                  <div>evens = [x for x in range(20) if x % 2 == 0]</div>
                  <div>&nbsp;</div>
                  <div># Dict comprehension</div>
                  <div>word_len = {'{'}word: len(word) for word in words{'}'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}