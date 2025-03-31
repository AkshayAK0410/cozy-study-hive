import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Target, 
  Zap, 
  Calendar, 
  ClipboardList, 
  Clock,
  BookOpen,
  Smartphone,
  LayoutDashboard,
  Salad,
  Activity,
  Sparkles,
  Music
} from "lucide-react";

const ProductivityGuides = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 mt-10">
        <div className="container px-4 mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Productivity Guides</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Master the art of productivity with comprehensive guides and practical strategies to help you accomplish more.
            </p>
          </div>
          
          <Tabs defaultValue="time-management" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full mb-8">
              <TabsTrigger value="time-management">Time Management</TabsTrigger>
              <TabsTrigger value="goal-setting">Goal Setting</TabsTrigger>
              <TabsTrigger value="student-productivity">Student Productivity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="time-management" className="animate-fade-in">
              <Card className="shadow-soft glass-effect mb-8">
                <CardHeader>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    <CardTitle>Time Management Fundamentals</CardTitle>
                  </div>
                  <CardDescription>
                    Master the basics of effective time management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Prioritization Techniques</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <h4 className="font-medium">The Eisenhower Matrix</h4>
                          <p className="text-muted-foreground">
                            Categorize tasks into four quadrants based on urgency and importance:
                          </p>
                          <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>Urgent & Important:</strong> Do these tasks immediately</li>
                            <li><strong>Important but Not Urgent:</strong> Schedule these tasks</li>
                            <li><strong>Urgent but Not Important:</strong> Delegate these tasks if possible</li>
                            <li><strong>Neither Urgent nor Important:</strong> Eliminate these tasks</li>
                          </ul>
                          
                          <h4 className="font-medium pt-2">The ABCDE Method</h4>
                          <p className="text-muted-foreground">
                            Assign letters to tasks based on priority:
                          </p>
                          <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>A:</strong> Must do – serious consequences if not completed</li>
                            <li><strong>B:</strong> Should do – mild consequences if not completed</li>
                            <li><strong>C:</strong> Nice to do – no consequences</li>
                            <li><strong>D:</strong> Delegate – tasks others can do</li>
                            <li><strong>E:</strong> Eliminate – tasks that don't need to be done</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Time Blocking Strategies</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p className="text-muted-foreground">
                            Time blocking is the practice of scheduling specific time periods for certain tasks or types of work.
                          </p>
                          
                          <h4 className="font-medium">How to Implement Time Blocking:</h4>
                          <ol className="list-decimal list-inside space-y-2 pl-4">
                            <li>Review your priorities and tasks</li>
                            <li>Estimate how long each task will take</li>
                            <li>Schedule specific blocks in your calendar</li>
                            <li>Include buffer time between blocks</li>
                            <li>Batch similar tasks together</li>
                            <li>Protect your blocked time from interruptions</li>
                          </ol>
                          
                          <h4 className="font-medium pt-2">Types of Time Blocks:</h4>
                          <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>Focus blocks:</strong> Deep work with no interruptions</li>
                            <li><strong>Buffer blocks:</strong> Time for catching up and handling overflow</li>
                            <li><strong>Admin blocks:</strong> Email, meetings, and administrative tasks</li>
                            <li><strong>Social blocks:</strong> Time dedicated to networking and communication</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Overcoming Procrastination</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <h4 className="font-medium">Understanding Procrastination</h4>
                          <p className="text-muted-foreground">
                            Procrastination is often related to:
                          </p>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Fear of failure or perfectionism</li>
                            <li>Task aversion or difficulty</li>
                            <li>Lack of motivation or interest</li>
                            <li>Poor energy management</li>
                          </ul>
                          
                          <h4 className="font-medium pt-2">Techniques to Beat Procrastination:</h4>
                          <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                              <strong>The 2-Minute Rule:</strong> If a task takes less than 2 minutes, do it immediately.
                            </li>
                            <li>
                              <strong>The 5-Minute Rule:</strong> Commit to working on a task for just 5 minutes; often you'll continue once started.
                            </li>
                            <li>
                              <strong>Temptation Bundling:</strong> Pair an activity you need to do with something you want to do.
                            </li>
                            <li>
                              <strong>Implementation Intentions:</strong> Create specific plans using "If-Then" statements.
                            </li>
                            <li>
                              <strong>Pomodoro Technique:</strong> Work in focused sprints with breaks in between.
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goal-setting" className="animate-fade-in">
              <Card className="shadow-soft glass-effect mb-8">
                <CardHeader>
                  <div className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    <CardTitle>Effective Goal Setting Frameworks</CardTitle>
                  </div>
                  <CardDescription>
                    Learn how to set meaningful and achievable goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>SMART Goal Framework</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p className="text-muted-foreground">
                            The SMART framework helps create well-defined goals:
                          </p>
                          <ul className="list-disc list-inside space-y-3 pl-4">
                            <li>
                              <strong>Specific:</strong> Clearly define what you want to accomplish. Ask yourself: What, Why, Who, Where, and When?
                            </li>
                            <li>
                              <strong>Measurable:</strong> Include concrete criteria for measuring progress. How much? How many? How will you know when it's accomplished?
                            </li>
                            <li>
                              <strong>Achievable:</strong> Make sure the goal is realistic and attainable. Consider your resources and constraints.
                            </li>
                            <li>
                              <strong>Relevant:</strong> Ensure the goal matters to you and aligns with broader objectives. Is it worthwhile? Is this the right time?
                            </li>
                            <li>
                              <strong>Time-bound:</strong> Set a deadline to create urgency and focus. When will you accomplish this?
                            </li>
                          </ul>
                          
                          <h4 className="font-medium pt-2">Example:</h4>
                          <p className="text-muted-foreground">
                            Instead of "I want to get better grades," a SMART goal would be: "I will improve my GPA from 3.2 to 3.5 by the end of this semester by studying an extra hour each day and attending weekly tutoring sessions."
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>OKRs - Objectives and Key Results</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p className="text-muted-foreground">
                            OKRs combine ambitious objectives with specific measurable key results:
                          </p>
                          
                          <h4 className="font-medium">Components:</h4>
                          <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                              <strong>Objectives:</strong> Qualitative, ambitious goals that provide direction and meaning
                            </li>
                            <li>
                              <strong>Key Results:</strong> Quantitative metrics that measure progress toward the objective (typically 3-5 per objective)
                            </li>
                          </ul>
                          
                          <h4 className="font-medium pt-2">Characteristics of Good OKRs:</h4>
                          <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>Objectives should be inspirational, meaningful, and action-oriented</li>
                            <li>Key results should be specific, measurable, and time-bound</li>
                            <li>Good OKRs are challenging but achievable (aim for 60-70% completion rate)</li>
                            <li>They're transparent and visible to everyone</li>
                            <li>They're reviewed regularly (typically quarterly)</li>
                          </ul>
                          
                          <h4 className="font-medium pt-2">Example:</h4>
                          <p><strong>Objective:</strong> Excel in my computer science degree</p>
                          <p><strong>Key Results:</strong></p>
                          <ol className="list-decimal list-inside pl-4">
                            <li>Complete 3 programming projects with at least 90% scores</li>
                            <li>Attend 100% of lectures and participate in at least 5 study groups</li>
                            <li>Score above 85% on all exams</li>
                          </ol>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="student-productivity" className="animate-fade-in">
              <Card className="shadow-soft glass-effect mb-8">
                <CardHeader>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    <CardTitle>Student Productivity Systems</CardTitle>
                  </div>
                  <CardDescription>
                    Specialized productivity systems for academic success
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Exam Preparation System</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <h4 className="font-medium">4-Week Exam Preparation Timeline:</h4>
                          
                          <h5 className="font-medium text-sm">Week 1-2: Content Review</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Create a comprehensive list of topics to be covered</li>
                            <li>Gather and organize all relevant materials (textbooks, notes, handouts)</li>
                            <li>Review each topic in detail, creating summary notes</li>
                            <li>Identify areas of weakness that need extra attention</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">Week 3: Practice and Application</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Complete practice problems for each topic</li>
                            <li>Take topic-specific quizzes to test understanding</li>
                            <li>Create and review flashcards for key concepts</li>
                            <li>Study in groups to discuss complex topics</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">Week 4: Integration and Full Practice</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Take full-length practice exams under timed conditions</li>
                            <li>Review mistakes and revisit challenging topics</li>
                            <li>Practice explaining concepts out loud (Feynman Technique)</li>
                            <li>Focus on memory techniques for key facts and formulas</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">Final Days Before Exam</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Review summary notes and key concepts</li>
                            <li>Get adequate sleep and nutrition</li>
                            <li>Prepare materials needed for exam day</li>
                            <li>Use relaxation techniques to manage anxiety</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Research Paper Workflow</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <h4 className="font-medium">7-Step Research Paper Process:</h4>
                          
                          <h5 className="font-medium text-sm">1. Topic Selection and Research Question (Days 1-3)</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Brainstorm potential topics of interest</li>
                            <li>Narrow down to a specific research question</li>
                            <li>Conduct preliminary research to ensure sufficient sources exist</li>
                            <li>Get approval from instructor if required</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">2. Literature Research (Days 4-10)</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Use academic databases (JSTOR, Google Scholar, etc.)</li>
                            <li>Collect and organize relevant sources</li>
                            <li>Create citation entries as you go</li>
                            <li>Take detailed notes on each source</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">3. Outline Creation (Days 11-13)</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Develop a thesis statement</li>
                            <li>Create a detailed outline with main points and subpoints</li>
                            <li>Organize your research to support each section</li>
                            <li>Plan introduction and conclusion</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">4. First Draft Writing (Days 14-20)</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Focus on content rather than perfect wording</li>
                            <li>Write according to your outline</li>
                            <li>Include citations as you write</li>
                            <li>Set daily word count goals</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">5. Revision (Days 21-25)</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Take a day away from the paper before revising</li>
                            <li>Check for logical flow and organization</li>
                            <li>Strengthen arguments with additional evidence if needed</li>
                            <li>Ensure all claims are supported by sources</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">6. Editing and Formatting (Days 26-28)</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Check grammar, spelling, and punctuation</li>
                            <li>Format according to required style guide (APA, MLA, etc.)</li>
                            <li>Finalize bibliography and in-text citations</li>
                            <li>Consider peer review for feedback</li>
                          </ul>
                          
                          <h5 className="font-medium text-sm pt-2">7. Final Review and Submission (Days 29-30)</h5>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Read the entire paper aloud to catch errors</li>
                            <li>Double-check all requirements and instructions</li>
                            <li>Submit with time to spare in case of technical issues</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductivityGuides;
