"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  HelpCircle, 
  Search, 
  Book,
  MessageSquare,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown
} from "lucide-react"
import { toast } from "sonner"

const faqItems = [
  {
    id: 1,
    category: "Getting Started",
    question: "How do I create my first project?",
    answer: "To create a new project, navigate to the Projects page and click the 'New Project' button. Fill in the project details including name, budget, timeline, and team members.",
  },
  {
    id: 2,
    category: "Payments",
    question: "How do I set up payment methods?",
    answer: "Go to the Payments page and click 'Add Method'. You can add bank transfers, credit cards, or digital wallets. Set one as your default payment method.",
  },
  {
    id: 3,
    category: "Invoicing",
    question: "Can I customize invoice templates?",
    answer: "Yes, you can customize invoice templates in Settings > Invoice Templates. You can modify colors, add your logo, and customize fields.",
  },
  {
    id: 4,
    category: "Security",
    question: "How do I manage user permissions?",
    answer: "User permissions are managed in the Permissions page. You can create custom roles and assign specific permissions for each feature.",
  },
  {
    id: 5,
    category: "Analytics",
    question: "What reports are available?",
    answer: "TriFi provides comprehensive analytics including financial reports, project progress, team performance, and custom dashboards.",
  },
]

const supportResources = [
  {
    title: "User Guide",
    description: "Complete documentation for all TriFi features",
    icon: Book,
    link: "/docs/user-guide",
  },
  {
    title: "API Documentation",
    description: "Developer resources and API reference",
    icon: Book,
    link: "/docs/api",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    icon: ExternalLink,
    link: "https://tutorials.trifi.ph",
  },
  {
    title: "Community Forum",
    description: "Connect with other TriFi users",
    icon: MessageSquare,
    link: "https://community.trifi.ph",
  },
]

const contactOptions = [
  {
    title: "Email Support",
    description: "Get help via email within 24 hours",
    icon: Mail,
    contact: "support@trifi.ph",
    action: "Send Email",
  },
  {
    title: "Phone Support",
    description: "Call us for immediate assistance",
    icon: Phone,
    contact: "+63 2 8123 4567",
    action: "Call Now",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team",
    icon: MessageSquare,
    contact: "Available Mon-Fri 9AM-6PM PST",
    action: "Start Chat",
  },
]

export default function HelpPage() {
  const handleContactSupport = () => {
    toast.info("Opening contact support form...")
  }

  const handleContactAction = (action: string, contact: string) => {
    switch (action) {
      case "Send Email":
        window.location.href = `mailto:${contact}`
        toast.success(`Opening email to ${contact}`)
        break
      case "Call Now":
        toast.success(`Calling ${contact}`)
        break
      case "Start Chat":
        toast.info("Starting live chat...")
        break
      default:
        break
    }
  }

  const handleResourceOpen = (title: string, link: string) => {
    toast.info(`Opening ${title}...`)
    if (link.startsWith("http")) {
      window.open(link, "_blank")
    } else {
      // Navigate to internal link
      console.log(`Navigate to ${link}`)
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "View Documentation":
        toast.info("Opening documentation...")
        break
      case "Report an Issue":
        toast.info("Opening issue report form...")
        break
      case "Feature Request":
        toast.info("Opening feature request form...")
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <Button onClick={handleContactSupport}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">How can we help you?</h2>
            <p className="text-muted-foreground">
              Search our knowledge base or browse categories below
            </p>
          </div>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search help articles..." 
              className="w-full pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <h3 className="font-medium">{item.question}</h3>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactOptions.map((option, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <option.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{option.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {option.description}
                        </p>
                        <p className="text-sm font-medium mb-3">
                          {option.contact}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleContactAction(option.action, option.contact)}
                        >
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Support Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {supportResources.map((resource, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-muted rounded-full">
                    <resource.icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-medium">{resource.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {resource.description}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleResourceOpen(resource.title, resource.link)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickAction("View Documentation")}
            >
              <Book className="h-6 w-6" />
              <span>View Documentation</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickAction("Report an Issue")}
            >
              <MessageSquare className="h-6 w-6" />
              <span>Report an Issue</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickAction("Feature Request")}
            >
              <ExternalLink className="h-6 w-6" />
              <span>Feature Request</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 