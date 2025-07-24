"use client"

import { useState } from "react"
import { AnimatedHeroSection } from "./animated-hero-section"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
import { LandingNav } from "./landing-nav"
import { BarChart3, CreditCard, DollarSign, Globe, Lock, MessageCircle, Shield, TrendingUp, Users, Zap, Smartphone } from "lucide-react"
import Link from "next/link"
import { AnimatedPricingCard } from "./ui/animated-pricing-card"

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time financial analytics with AI-powered insights and predictive modeling."
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description: "Secure, fast payment processing with support for multiple currencies and payment methods."
  },
  {
    icon: Shield,
    title: "Bank-Grade Security", 
    description: "Enterprise-level security with encryption, fraud detection, and compliance standards."
  },
  {
    icon: TrendingUp,
    title: "Investment Tracking",
    description: "Comprehensive portfolio management with real-time market data and performance analytics."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Multi-user accounts with role-based permissions and collaborative financial planning."
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Responsive design that works perfectly on all devices with offline capabilities."
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CFO, TechStart Inc.",
    content: "TriFi transformed how we handle our finances. The analytics are incredibly detailed and the automation saves us hours every week.",
    rating: 5
  },
  {
    name: "Michael Rodriguez", 
    role: "Finance Director, GreenTech Solutions",
    content: "The investment tracking features are outstanding. We've seen a 30% improvement in our portfolio performance since switching to TriFi.",
    rating: 5
  },
  {
    name: "Emily Johnson",
    role: "Small Business Owner",
    content: "As a small business owner, TriFi's affordable pricing and powerful features have been a game-changer for managing my finances.",
    rating: 5
  }
]

export function LandingPage() {
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <AnimatedHeroSection />
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              🚀 Next-Generation Financial Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Advanced Financial Management for Modern Businesses
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline your financial operations with AI-powered analytics, secure payment processing, 
              and comprehensive investment tracking. Built for the future of finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/sign-up">
                <Button size="lg" className="gradient-bg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
            
            {/* Email Signup */}
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button>Get Started</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                No credit card required. Start your 30-day free trial today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Modern Finance</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage, analyze, and grow your financial operations in one comprehensive platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing for teams of all sizes. Start for free, upgrade anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <AnimatedPricingCard
              planName="Free"
              description="Get started with essential features for individuals and small teams."
              price="₱0"
              features={["Basic analytics dashboard", "Up to 3 projects", "Community support"]}
              buttonText="Get Started"
              variant="basic"
              onButtonClick={() => window.location.href = '/sign-up'}
            />
            {/* Premium Plan */}
            <AnimatedPricingCard
              planName="Premium"
              description="Unlock advanced analytics, automation, and integrations."
              price="₱499"
              originalPrice="₱799"
              features={["All Free features", "Unlimited projects", "Advanced analytics", "Priority email support", "Automations & integrations"]}
              buttonText="Buy Premium"
              isPopular
              isRecommended
              variant="premium"
              onButtonClick={() => window.location.href = '/sign-up'}
            />
            {/* Enterprise Plan */}
            <AnimatedPricingCard
              planName="Enterprise"
              description="Custom solutions and dedicated support for large organizations."
              price="Contact Us"
              features={["All Premium features", "Custom integrations", "Dedicated account manager", "24/7 priority support", "Onboarding & training"]}
              buttonText="Contact Sales"
              variant="enterprise"
              onButtonClick={() => window.location.href = '/contact'}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Finance Professionals</h2>
            <p className="text-xl text-muted-foreground">
              See what our customers are saying about TriFi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Financial Operations?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using TriFi to streamline their financial management and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="gradient-bg">
                Start Your Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TriFi</h3>
              <p className="text-muted-foreground">
                Advanced financial management platform for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
                <li><a href="#" className="hover:text-foreground">Status</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2024 TriFi. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 