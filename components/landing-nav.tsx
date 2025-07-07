"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TriFiLogo, TriFiIcon } from "@/components/trifi-logo"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PremiumThemeToggle } from "@/components/ui/premium-theme-toggle"
import { useTheme } from "next-themes"

interface LandingNavProps {
  onWatchDemo?: () => void
}

export function LandingNav({ onWatchDemo }: LandingNavProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    {
      label: "Product",
      href: "#features",
      dropdown: [
        { label: "Features", href: "#features", description: "Comprehensive financial tools" },
        { label: "Analytics", href: "#analytics", description: "Real-time insights & reporting" },
        { label: "Integrations", href: "#integrations", description: "Connect with your tools" },
        { label: "Security", href: "#security", description: "Bank-level protection" },
      ]
    },
    {
      label: "Solutions",
      href: "#solutions",
      dropdown: [
        { label: "Small Business", href: "#small-business", description: "Perfect for startups" },
        { label: "Enterprise", href: "#enterprise", description: "Scale with confidence" },
        { label: "Accounting Firms", href: "#accounting", description: "Professional services" },
        { label: "Freelancers", href: "#freelancers", description: "Individual professionals" },
      ]
    },
    {
      label: "Pricing",
      href: "#pricing"
    },
    {
      label: "Resources",
      href: "#resources",
      dropdown: [
        { label: "Documentation", href: "/docs", description: "Complete API reference" },
        { label: "Help Center", href: "/help", description: "Get support" },
        { label: "Blog", href: "/blog", description: "Latest insights" },
        { label: "Community", href: "/community", description: "Join the discussion" },
      ]
    }
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  // Determine text color based on scroll state and theme
  const getNavTextColor = () => {
    if (isScrolled) {
      return "text-fintech-neutral-700 hover:text-fintech-primary dark:text-fintech-neutral-300 dark:hover:text-fintech-primary"
    } else {
      // When not scrolled, use different colors based on theme
      return isDarkTheme 
        ? "text-white hover:text-fintech-neutral-200" 
        : "text-fintech-neutral-800 hover:text-fintech-primary"
    }
  }

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple",
        isScrolled 
          ? "bg-white/80 dark:bg-fintech-neutral-900/80 backdrop-blur-xl border-b border-fintech-neutral-200/50 dark:border-fintech-neutral-700/50 shadow-fintech-lg" 
          : isDarkTheme 
            ? "bg-transparent" 
            : "bg-white/95 backdrop-blur-sm"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => scrollToSection('#top')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <TriFiLogo 
                  className="w-8 h-8 lg:w-10 lg:h-10" 
                  variant={isScrolled ? "default" : "default"}
                />
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-fintech-primary to-fintech-accent bg-clip-text text-transparent">
                  TriFi
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.dropdown ? (
                    <div>
                      <button
                        className={cn(
                          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                          getNavTextColor()
                        )}
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {item.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div 
                        className={cn(
                          "absolute top-full left-0 mt-2 w-64 rounded-2xl border border-fintech-neutral-200 dark:border-fintech-neutral-700 shadow-fintech-xl bg-white dark:bg-fintech-neutral-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-apple",
                          activeDropdown === item.label && "opacity-100 visible"
                        )}
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="p-2">
                          {item.dropdown.map((dropdownItem) => (
                            <button
                              key={dropdownItem.label}
                              onClick={() => scrollToSection(dropdownItem.href)}
                              className="w-full text-left p-3 rounded-xl hover:bg-fintech-neutral-50 dark:hover:bg-fintech-neutral-800 transition-colors group/item"
                            >
                              <div className="font-medium text-fintech-neutral-900 dark:text-fintech-neutral-100 group-hover/item:text-fintech-primary transition-colors">
                                {dropdownItem.label}
                              </div>
                              <div className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400 mt-1">
                                {dropdownItem.description}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                        getNavTextColor()
                      )}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {onWatchDemo && (
                <Button
                  variant="ghost"
                  onClick={onWatchDemo}
                  className={cn(
                    "font-medium",
                    isScrolled 
                      ? "text-fintech-neutral-700 hover:text-fintech-primary hover:bg-fintech-neutral-100 dark:text-fintech-neutral-300 dark:hover:text-fintech-primary dark:hover:bg-fintech-neutral-800" 
                      : isDarkTheme 
                        ? "text-white hover:text-fintech-neutral-200 hover:bg-white/10"
                        : "text-fintech-neutral-700 hover:text-fintech-primary hover:bg-fintech-neutral-100"
                  )}
                >
                  Watch Demo
                </Button>
              )}
              
              {/* Premium Theme Toggle */}
              <PremiumThemeToggle variant="nav" />
              
              <SignInButton mode="modal">
                <Button
                  variant={isScrolled ? "outline" : "outline"}
                  className={cn(
                    "font-medium",
                    !isScrolled && isDarkTheme && "border-white/20 text-white hover:bg-white/10",
                    !isScrolled && !isDarkTheme && "border-fintech-neutral-300 text-fintech-neutral-800 hover:bg-fintech-neutral-100"
                  )}
                >
                  Sign In
                </Button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <Button
                  variant={isScrolled ? "default" : "default"}
                  className={cn(
                    "font-medium",
                    !isScrolled && isDarkTheme && "bg-white text-fintech-primary hover:bg-fintech-neutral-100",
                    !isScrolled && !isDarkTheme && "bg-fintech-primary text-white hover:bg-fintech-primary/90"
                  )}
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </SignUpButton>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  getNavTextColor()
                )}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-fintech-neutral-900 border-b border-fintech-neutral-200 dark:border-fintech-neutral-700 shadow-fintech-xl transition-all duration-300 ease-apple",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}>
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="flex items-center justify-between w-full p-3 text-left font-medium text-fintech-neutral-900 dark:text-fintech-neutral-100 hover:text-fintech-primary transition-colors rounded-lg hover:bg-fintech-neutral-50 dark:hover:bg-fintech-neutral-800"
                  >
                    {item.label}
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {item.dropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.dropdown.map((dropdownItem) => (
                        <button
                          key={dropdownItem.label}
                          onClick={() => scrollToSection(dropdownItem.href)}
                          className="block w-full text-left p-2 text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400 hover:text-fintech-primary transition-colors rounded-lg hover:bg-fintech-neutral-50 dark:hover:bg-fintech-neutral-800"
                        >
                          {dropdownItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-6 border-t border-fintech-neutral-200 dark:border-fintech-neutral-700 space-y-3">
                {/* Theme Toggle for Mobile */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-fintech-neutral-900 dark:text-fintech-neutral-100">
                    Theme
                  </span>
                  <PremiumThemeToggle variant="nav" />
                </div>
                
                {onWatchDemo && (
                  <Button
                    variant="outline"
                    onClick={onWatchDemo}
                    className="w-full font-medium"
                  >
                    Watch Demo
                  </Button>
                )}
                
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="w-full font-medium"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <Button
                    variant="default"
                    className="w-full font-medium"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 lg:h-20" />
    </>
  )
}