
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle } from "lucide-react";

const faqCategories = [
  {
    title: "Getting Started",
    faqs: [
      {
        question: "What is the Pomodoro Technique?",
        answer: "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are known as 'pomodoros'. The technique encourages you to work with the time you have rather than against it, eliminating the anxiety of time's passing."
      },
      {
        question: "How does StudyNook help with the Pomodoro Technique?",
        answer: "StudyNook provides a customizable Pomodoro timer that helps you implement the technique effectively. You can adjust work durations, break lengths, and set how many sessions to complete before taking a longer break. The app also tracks your completed sessions, allowing you to monitor your productivity over time."
      },
      {
        question: "Do I need to create an account to use StudyNook?",
        answer: "While you can use the basic Pomodoro timer without an account, creating a free account allows you to save your preferences, track your study history, manage tasks, and access additional features like focus sounds and progress statistics."
      },
      {
        question: "Is StudyNook free to use?",
        answer: "Yes, StudyNook offers a free tier with all essential features. We may introduce premium features in the future, but the core functionality will always remain free for students and productivity enthusiasts."
      }
    ]
  },
  {
    title: "Features & Usage",
    faqs: [
      {
        question: "Can I customize the Pomodoro timer settings?",
        answer: "Absolutely! StudyNook allows you to customize the work duration (default is 25 minutes), short break duration (default is 5 minutes), long break duration (default is 15 minutes), and how many work sessions to complete before taking a long break (default is 4)."
      },
      {
        question: "What are Focus Sounds and how do they help?",
        answer: "Focus Sounds are ambient background noises like rain, cafe ambience, or lo-fi music that can help mask distracting noises and create a conducive environment for concentration. Many users find that certain sounds help them enter a flow state more easily. You can adjust the volume or mute these sounds at any time."
      },
      {
        question: "How does the task management feature work?",
        answer: "StudyNook's task management allows you to create a list of tasks you want to complete during your study session. You can estimate how many pomodoros each task might take, mark them as complete when finished, and associate specific pomodoro sessions with particular tasks to track how you're spending your study time."
      },
      {
        question: "Can I see statistics about my study habits?",
        answer: "Yes, StudyNook provides detailed statistics about your study sessions, including total study time, number of completed pomodoros, daily streaks, and your most productive times of day. These insights can help you optimize your study schedule and track your progress over time."
      }
    ]
  },
  {
    title: "Account & Data",
    faqs: [
      {
        question: "How secure is my data on StudyNook?",
        answer: "StudyNook takes data security seriously. We use Supabase, a secure backend service with PostgreSQL databases that implements robust security measures. Your personal information and study data are encrypted and protected according to industry standards."
      },
      {
        question: "Can I delete my account and all associated data?",
        answer: "Yes, you can delete your account and all associated data from your profile settings. Once deleted, all your personal information and study history will be permanently removed from our systems."
      },
      {
        question: "Does StudyNook work offline?",
        answer: "The core timer functionality works offline once the page is loaded. However, features like saving session history, syncing across devices, and some focus sounds may require an internet connection."
      },
      {
        question: "How can I change my account settings?",
        answer: "You can update your account settings, including your name, email, and password, from the Profile page. You can also customize your study preferences, notification settings, and theme preferences from the same page."
      }
    ]
  },
  {
    title: "Technical Support",
    faqs: [
      {
        question: "The timer sounds aren't working. What should I do?",
        answer: "First, check if your device's sound is turned on and not muted. Make sure you've allowed browser notifications and audio playback. Try using a different browser or clearing your browser cache. If problems persist, try updating your browser to the latest version."
      },
      {
        question: "How can I report a bug or suggest a feature?",
        answer: "We welcome your feedback! You can report bugs or suggest features by emailing our support team at support@studynook.com or by using the feedback form in the app's footer."
      },
      {
        question: "Is StudyNook available as a mobile app?",
        answer: "Currently, StudyNook is a web application optimized for both desktop and mobile browsers. We are considering developing native mobile apps in the future based on user demand."
      },
      {
        question: "Can I use StudyNook on multiple devices?",
        answer: "Yes, with a user account, your settings, tasks, and study history will sync across all devices when you log in to StudyNook."
      }
    ]
  }
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState("Getting Started");
  
  // Filter FAQs based on search term
  const filteredFAQs = searchTerm
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(
          faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 mt-10">
        <div className="container px-4 mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about StudyNook and how to make the most of our features.
            </p>
          </div>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {/* FAQ Categories */}
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((category) => (
                <Card key={category.title} className="mb-6 shadow-soft glass-effect">
                  <CardHeader 
                    className="cursor-pointer" 
                    onClick={() => setExpandedCategory(
                      expandedCategory === category.title ? "" : category.title
                    )}
                  >
                    <CardTitle className="text-xl flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      {category.faqs.length} question{category.faqs.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  {(expandedCategory === category.title || searchTerm) && (
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No questions match your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
            
            {/* Contact Support */}
            <Card className="mt-10 shadow-soft glass-effect bg-primary/5">
              <CardHeader>
                <CardTitle className="text-center">Still have questions?</CardTitle>
                <CardDescription className="text-center">
                  Our support team is here to help you with any other questions you might have.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button>Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
