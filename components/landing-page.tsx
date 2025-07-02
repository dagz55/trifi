"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  BarChart3, 
  Building2, 
  Calculator, 
  Check,
  CreditCard, 
  DollarSign, 
  FileText, 
  PieChart, 
  Play,
  Shield, 
  TrendingUp, 
  Users, 
  Wallet,
  Zap,
  Smartphone,
  Globe
} from "lucide-react"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useState } from "react"

export function LandingPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const features = [
    {
      icon: BarChart3,
      title: "Financial Analytics",
      description: "Get comprehensive insights into your financial performance with real-time analytics and AI-powered reporting.",
      gradient: "gradient-blue"
    },
    {
      icon: Calculator,
      title: "Smart Accounting",
      description: "Automate your accounting processes with intelligent categorization and seamless reconciliation.",
      gradient: "gradient-green"
    },
    {
      icon: CreditCard,
      title: "Payment Management",
      description: "Streamline payments, invoicing, and money transfers with secure, integrated solutions.",
      gradient: "gradient-purple"
    },
    {
      icon: Building2,
      title: "Organization Management",
      description: "Manage your company structure, departments, and organizational hierarchy efficiently.",
      gradient: "gradient-blue"
    },
    {
      icon: FileText,
      title: "Invoice & Billing",
      description: "Create professional invoices, track payments, and manage billing cycles seamlessly.",
      gradient: "gradient-green"
    },
    {
      icon: PieChart,
      title: "Budget Tracking",
      description: "Monitor expenses, set budgets, and track financial goals with detailed breakdowns.",
      gradient: "gradient-purple"
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security measures.",
      color: "status-green"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Insights",
      description: "Make informed decisions with live financial data and predictive analytics.",
      color: "status-blue"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team on financial planning and management tasks.",
      color: "status-purple"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "₱0",
      period: "/month",
      description: "Perfect for individuals and small startups",
      features: [
        "Up to 50 transactions per month",
        "Basic financial reporting",
        "1 business account",
        "Email support",
        "Mobile app access",
        "Basic budget tracking"
      ],
      recommended: false,
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const
    },
    {
      name: "Premium",
      price: "₱2,499",
      period: "/month",
      description: "Ideal for growing businesses and teams",
      features: [
        "Unlimited transactions",
        "Advanced analytics & reporting",
        "Up to 5 business accounts",
        "Priority support",
        "API access",
        "Advanced budget tracking",
        "Invoice management",
        "Team collaboration (up to 10 users)",
        "Custom categories",
        "Export to Excel/PDF"
      ],
      recommended: true,
      buttonText: "Start Premium Trial",
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      price: "₱9,999",
      period: "/month",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Premium",
        "Unlimited business accounts",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Advanced security features",
        "Custom reporting",
        "Unlimited team members",
        "SSO integration",
        "Audit trails",
        "White-label options",
        "On-premise deployment option"
      ],
      recommended: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ]

  const handleWatchDemo = () => {
    setIsVideoModalOpen(true)
  }

  const handleContactSales = () => {
    window.open('mailto:sales@trifi.com?subject=Enterprise%20Plan%20Inquiry', '_blank')
  }

  const testimonials = [
    {
      name: "Maria Santos",
      role: "CFO, TechStart Inc.",
      content: "TriFi transformed our financial management. The real-time insights and automated reporting saved us 20+ hours per week.",
      avatar: "MS"
    },
    {
      name: "John Rodriguez", 
      role: "Business Owner",
      content: "The Apple-style interface makes complex financial tasks feel simple. Our team adopted it immediately.",
      avatar: "JR"
    },
    {
      name: "Ana dela Cruz",
      role: "Accounting Manager",
      content: "Best financial platform we've used. The automation features and Philippine peso support are perfect for our business.",
      avatar: "AC"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="nav-blur border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-blue rounded-2xl flex items-center justify-center shadow-apple">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">TriFi</span>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton mode="modal">
              <Button variant="ghost" className="apple-button">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="apple-button gradient-blue text-white border-0">Get Started</Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <Badge variant="secondary" className="mb-6 px-4 py-2 rounded-full text-sm">
            <Zap className="h-4 w-4 mr-2" />
            Complete Financial Management Solution
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-8">
            Take Control of Your
            <span className="gradient-blue bg-clip-text text-transparent"> Finances</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            TriFi is your all-in-one financial management platform. Track expenses, manage invoices, 
            analyze performance, and grow your business with powerful tools designed for modern organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="apple-button gradient-blue text-white border-0 text-lg px-8 py-4 h-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
            <Button 
              size="lg" 
              variant="outline" 
              className="apple-button text-lg px-8 py-4 h-auto"
              onClick={handleWatchDemo}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex items-center justify-center space-x-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Bank-Level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm">Philippines Focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm">Mobile Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From basic accounting to advanced analytics, TriFi provides all the tools you need to 
            make informed financial decisions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card apple-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-apple`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Trusted by Financial Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what business leaders are saying about TriFi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card apple-hover">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-blue rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with our free plan and upgrade as your business grows. All plans include our core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`glass-card relative ${plan.recommended ? 'border-primary shadow-apple-lg scale-105' : 'apple-hover'}`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-blue text-white px-4 py-2 shadow-apple">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-6">
                    <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-4">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 status-green mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.name === "Enterprise" ? (
                    <Button 
                      className="w-full apple-button" 
                      variant={plan.buttonVariant}
                      onClick={handleContactSales}
                    >
                      {plan.buttonText}
                    </Button>
                  ) : (
                    <SignUpButton mode="modal">
                      <Button className={`w-full apple-button ${plan.recommended ? 'gradient-blue text-white border-0' : ''}`} variant={plan.buttonVariant}>
                        {plan.buttonText}
                      </Button>
                    </SignUpButton>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Why Choose TriFi?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for businesses of all sizes with enterprise-grade features and security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 gradient-blue rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-apple">
                  <benefit.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to Transform Your Financial Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of businesses that trust TriFi to manage their finances efficiently and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="apple-button gradient-blue text-white border-0 text-lg px-8 py-4 h-auto">
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="apple-button text-lg px-8 py-4 h-auto">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-blue rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TriFi</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your trusted partner for comprehensive financial management and business growth.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="/api" className="hover:text-foreground transition-colors">API</a></li>
                <li><button onClick={handleWatchDemo} className="hover:text-foreground transition-colors">Demo</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="mailto:info@trifi.com" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="mailto:careers@trifi.com" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="mailto:contact@trifi.com" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="/help" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="/docs" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="https://community.trifi.com" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="https://status.trifi.com" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 TriFi. All rights reserved. Built with ♥ for Filipino businesses.</p>
          </div>
        </div>
      </footer>

      {/* Video Demo Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-apple-xl">
            <div className="flex justify-between items-center p-6 border-b border-border/50">
              <h3 className="text-xl font-semibold">TriFi Demo</h3>
              <Button 
                variant="ghost" 
                onClick={() => setIsVideoModalOpen(false)}
                className="h-8 w-8 p-0 rounded-lg apple-button"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Demo video coming soon!</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Experience the power of TriFi's Apple-style financial management platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 