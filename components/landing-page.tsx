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
  Wallet 
} from "lucide-react"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useState } from "react"

export function LandingPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const features = [
    {
      icon: BarChart3,
      title: "Financial Analytics",
      description: "Get comprehensive insights into your financial performance with real-time analytics and reporting."
    },
    {
      icon: Calculator,
      title: "Smart Accounting",
      description: "Automate your accounting processes with AI-powered categorization and reconciliation."
    },
    {
      icon: CreditCard,
      title: "Payment Management",
      description: "Streamline payments, invoicing, and money transfers with secure, integrated solutions."
    },
    {
      icon: Building2,
      title: "Organization Management",
      description: "Manage your company structure, departments, and organizational hierarchy efficiently."
    },
    {
      icon: FileText,
      title: "Invoice & Billing",
      description: "Create professional invoices, track payments, and manage billing cycles seamlessly."
    },
    {
      icon: PieChart,
      title: "Budget Tracking",
      description: "Monitor expenses, set budgets, and track financial goals with detailed breakdowns."
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security measures."
    },
    {
      icon: TrendingUp,
      title: "Real-Time Insights",
      description: "Make informed decisions with live financial data and predictive analytics."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team on financial planning and management tasks."
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

  const handleFooterLink = (section: string) => {
    // Scroll to relevant section or show modal
    const element = document.getElementById(section.toLowerCase())
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TriFi</span>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Complete Financial Management Solution
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Take Control of Your
            <span className="text-blue-600"> Finances</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            TriFi is your all-in-one financial management platform. Track expenses, manage invoices, 
            analyze performance, and grow your business with powerful tools designed for modern organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={handleWatchDemo}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From basic accounting to advanced analytics, TriFi provides all the tools you need to 
            make informed financial decisions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with our free plan and upgrade as your business grows. All plans include our core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.recommended ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200 shadow-lg'}`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.name === "Enterprise" ? (
                    <Button 
                      className="w-full" 
                      variant={plan.buttonVariant}
                      onClick={handleContactSales}
                    >
                      {plan.buttonText}
                    </Button>
                  ) : (
                    <SignUpButton mode="modal">
                      <Button className="w-full" variant={plan.buttonVariant}>
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
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose TriFi?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for businesses of all sizes with enterprise-grade features and security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Financial Management?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of businesses that trust TriFi to manage their finances efficiently and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TriFi</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for comprehensive financial management and business growth.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => handleFooterLink('features')}
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('pricing')}
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('/api', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    API
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleWatchDemo}
                    className="hover:text-white transition-colors"
                  >
                    Demo
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => window.open('mailto:info@trifi.com?subject=About%20TriFi', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('/blog', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('mailto:careers@trifi.com?subject=Career%20Inquiry', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('mailto:contact@trifi.com?subject=Contact%20Inquiry', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => window.open('/help', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('/docs', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('https://community.trifi.com', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('https://status.trifi.com', '_blank')}
                    className="hover:text-white transition-colors"
                  >
                    Status
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TriFi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Demo Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">TriFi Demo</h3>
              <Button 
                variant="ghost" 
                onClick={() => setIsVideoModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <div className="p-6 text-center">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Demo video coming soon!</p>
                  <p className="text-sm text-gray-500 mt-2">
                    In the meantime, you can sign up for a free trial to explore all features.
                  </p>
                </div>
              </div>
              <SignUpButton mode="modal">
                <Button size="lg" className="w-full">
                  Start Free Trial Instead
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 