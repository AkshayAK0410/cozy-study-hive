
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User, ArrowRight } from "lucide-react";

// Updated blog posts with reliable image URLs
const blogPosts = [
  {
    id: "1",
    title: "How the Pomodoro Technique Transformed My Academic Life",
    excerpt: "Discover how this simple time management method helped me improve my focus, reduce procrastination, and achieve better grades.",
    date: "2023-10-15",
    author: "Emily Chen",
    category: "Time Management",
    tags: ["pomodoro", "productivity", "student life"],
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "2",
    title: "The Science of Effective Study: Research-Backed Techniques",
    excerpt: "Learn what cognitive science reveals about the most effective ways to study and retain information for the long term.",
    date: "2023-09-28",
    author: "Dr. Michael Rivera",
    category: "Study Techniques",
    tags: ["spaced repetition", "active recall", "cognitive science"],
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "3",
    title: "Building a Distraction-Free Study Environment",
    excerpt: "Create the perfect study space that minimizes distractions and maximizes your productivity, whether at home or on campus.",
    date: "2023-11-05",
    author: "Alex Johnson",
    category: "Environment",
    tags: ["focus", "home study", "organization"],
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "4",
    title: "Digital Tools Every Student Should Know About in 2023",
    excerpt: "A comprehensive guide to the most useful apps and digital tools that can revolutionize how you study and manage your academic life.",
    date: "2023-08-20",
    author: "Taylor Wong",
    category: "Technology",
    tags: ["apps", "digital tools", "note-taking"],
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "5",
    title: "Exam Season Survival Guide: Strategies for Success",
    excerpt: "Practical advice for preparing for multiple exams while maintaining your wellbeing and achieving your best possible results.",
    date: "2023-11-30",
    author: "Sophia Martinez",
    category: "Exam Preparation",
    tags: ["exams", "stress management", "planning"],
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "6",
    title: "The Power of Study Groups: Collaborative Learning Tips",
    excerpt: "How to form and maintain effective study groups that enhance learning through collaboration rather than distraction.",
    date: "2023-10-10",
    author: "James Wilson",
    category: "Collaborative Learning",
    tags: ["study groups", "collaboration", "peer learning"],
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }
];

const categories = [
  "All Categories",
  "Time Management",
  "Study Techniques",
  "Environment",
  "Technology",
  "Exam Preparation",
  "Collaborative Learning"
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  const filteredPosts = blogPosts.filter(post => {
    // Filter by search term
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 mt-10">
        <div className="container px-4 mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Study & Productivity Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Insights, tips, and strategies to help you excel in your studies and boost your productivity.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md px-3 py-2 bg-background"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover-scale transition-all duration-300 shadow-soft glass-effect">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0 h-auto text-primary flex items-center">
                      Read Article <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No articles match your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
