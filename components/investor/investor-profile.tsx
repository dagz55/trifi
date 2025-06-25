"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Target, DollarSign, Shield } from "lucide-react"

const investorData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    taxId: "",
  },
  investmentProfile: {
    riskTolerance: "",
    investmentExperience: "",
    timeHorizon: "",
    investmentGoals: [],
    annualIncome: "",
    netWorth: "",
    liquidityNeeds: "",
  },
  preferences: {
    autoRebalancing: false,
    dividendReinvestment: false,
    taxLossHarvesting: false,
    esgInvesting: false,
    notifications: {
      email: false,
      sms: false,
      push: false,
    },
  },
}

const riskQuestions = [
  {
    question: "How would you react to a 20% decline in your portfolio?",
    answer: "Hold and potentially buy more",
    score: 4,
  },
  {
    question: "What's your primary investment objective?",
    answer: "Long-term growth with moderate income",
    score: 3,
  },
  {
    question: "How much investment experience do you have?",
    answer: "5-10 years of active investing",
    score: 4,
  },
  {
    question: "When do you plan to start withdrawing from investments?",
    answer: "More than 10 years from now",
    score: 5,
  },
]

export function InvestorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(investorData)

  const handleSave = () => {
    setIsEditing(false)
    console.log("Saving profile data:", profileData)
  }

  const riskScore = riskQuestions.reduce((sum, q) => sum + q.score, 0) / riskQuestions.length
  const riskLevel = riskScore >= 4 ? "Aggressive" : riskScore >= 3 ? "Moderate" : "Conservative"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Investor Profile</h2>
        <Button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.personalInfo.name}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, name: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileData.personalInfo.email}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, email: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.personalInfo.phone}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, phone: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profileData.personalInfo.dateOfBirth}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, dateOfBirth: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profileData.personalInfo.address}
                readOnly={!isEditing}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    personalInfo: { ...profileData.personalInfo, address: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Investment Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="riskTolerance">Risk Tolerance</Label>
              <Select
                value={profileData.investmentProfile.riskTolerance}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    investmentProfile: { ...profileData.investmentProfile, riskTolerance: value },
                  })
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conservative">Conservative</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experience">Investment Experience</Label>
              <Select
                value={profileData.investmentProfile.investmentExperience}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    investmentProfile: { ...profileData.investmentProfile, investmentExperience: value },
                  })
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                  <SelectItem value="1-5 years">1-5 years</SelectItem>
                  <SelectItem value="5-10 years">5-10 years</SelectItem>
                  <SelectItem value="More than 10 years">More than 10 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timeHorizon">Time Horizon</Label>
              <Select
                value={profileData.investmentProfile.timeHorizon}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    investmentProfile: { ...profileData.investmentProfile, timeHorizon: value },
                  })
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short-term (1-3 years)">Short-term (1-3 years)</SelectItem>
                  <SelectItem value="Medium-term (3-10 years)">Medium-term (3-10 years)</SelectItem>
                  <SelectItem value="Long-term (10+ years)">Long-term (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Investment Goals</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profileData.investmentProfile.investmentGoals.map((goal) => (
                  <Badge key={goal} variant="secondary">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="income">Annual Income</Label>
              <Select
                value={profileData.investmentProfile.annualIncome}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    investmentProfile: { ...profileData.investmentProfile, annualIncome: value },
                  })
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Less than ₱50,000">Less than ₱50,000</SelectItem>
                  <SelectItem value="₱50,000 - ₱100,000">₱50,000 - ₱100,000</SelectItem>
                  <SelectItem value="₱100,000 - ₱150,000">₱100,000 - ₱150,000</SelectItem>
                  <SelectItem value="₱150,000 - ₱200,000">₱150,000 - ₱200,000</SelectItem>
                  <SelectItem value="More than ₱200,000">More than ₱200,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="netWorth">Net Worth</Label>
              <Select
                value={profileData.investmentProfile.netWorth}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    investmentProfile: { ...profileData.investmentProfile, netWorth: value },
                  })
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Less than ₱100,000">Less than ₱100,000</SelectItem>
                  <SelectItem value="₱100,000 - ₱500,000">₱100,000 - ₱500,000</SelectItem>
                  <SelectItem value="₱500,000 - ₱1,000,000">₱500,000 - ₱1,000,000</SelectItem>
                  <SelectItem value="More than ₱1,000,000">More than ₱1,000,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="liquidity">Liquidity Needs</Label>
              <Select
                value={profileData.investmentProfile.liquidityNeeds}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    investmentProfile: { ...profileData.investmentProfile, liquidityNeeds: value },
                  })
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{riskScore.toFixed(1)}/5</div>
              <Badge
                className={`mb-4 ${riskLevel === "Aggressive" ? "bg-red-100 text-red-800" : riskLevel === "Moderate" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
              >
                {riskLevel} Investor
              </Badge>
              <Progress value={riskScore * 20} className="mb-4" />
            </div>
            <div className="space-y-3">
              {riskQuestions.map((q, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium mb-1">{q.question}</p>
                  <p className="text-muted-foreground">{q.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Investment Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoRebalancing">Auto Rebalancing</Label>
                <Switch
                  id="autoRebalancing"
                  checked={profileData.preferences.autoRebalancing}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      preferences: { ...profileData.preferences, autoRebalancing: checked },
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dividendReinvestment">Dividend Reinvestment</Label>
                <Switch
                  id="dividendReinvestment"
                  checked={profileData.preferences.dividendReinvestment}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      preferences: { ...profileData.preferences, dividendReinvestment: checked },
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="taxLossHarvesting">Tax Loss Harvesting</Label>
                <Switch
                  id="taxLossHarvesting"
                  checked={profileData.preferences.taxLossHarvesting}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      preferences: { ...profileData.preferences, taxLossHarvesting: checked },
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="esgInvesting">ESG Investing</Label>
                <Switch
                  id="esgInvesting"
                  checked={profileData.preferences.esgInvesting}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      preferences: { ...profileData.preferences, esgInvesting: checked },
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
