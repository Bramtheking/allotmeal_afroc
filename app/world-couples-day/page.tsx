"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { collection, addDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { Heart, Trophy, Globe, Calendar, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { MpesaPaymentDialog } from "@/components/mpesa-payment-dialog"

const QUESTIONS = [
  {
    id: 1,
    question: "How many couples do you have?",
    type: "text",
  },
  {
    id: 2,
    question: "As a couple during what time do you become close together the longest?",
    options: ["Time of sickness", "Holiday periods", "Events periods", "Always together"],
  },
  {
    id: 3,
    question: "What is the most secret part of your marriage that bonds you together?",
    options: ["Finance", "Children", "Friends", "Love and passion"],
  },
  {
    id: 4,
    question: "To what extent has your marriage/relationship helped the society?",
    options: ["Financially/Economically", "Socially/Charity", "Spiritually", "Promote essence of marriage"],
  },
  {
    id: 5,
    question: "What is your ambition as a couple?",
    options: ["Gain more wealth", "Better healthcare", "Helping the needy", "Enigmatic passion & love bond"],
  },
  {
    id: 6,
    question: "What are your worst moments as a couple?",
    options: ["Conspiracy", "Financial constrain", "Sickness", "Age"],
  },
  {
    id: 7,
    question: "What is the most important thing to do to keep your relationship strong long-term?",
    options: [
      "Have financial security",
      "Keep secrets from each other",
      "Have good communication",
      "Visit marriage counsel",
    ],
  },
  {
    id: 8,
    question: "How do you like to work through disagreements and conflicts?",
    options: ["Silent treatment", "Discussion", "Involve/invite parents", "Pray about it"],
  },
  {
    id: 9,
    question: "What is the point of attraction/what's the best form a couple will stay connected?",
    options: ["Physical appearance", "Emotional connection", "Finance stability", "Good behaviour/personality"],
  },
  {
    id: 10,
    question: "What's the best way to deal with a cheating partner?",
    options: ["Divorce/break up with them", "Take revenge", "Counseling/talking to them", "Forgive them"],
  },
]

export default function WorldCouplesDayPage() {
  const router = useRouter()
  const [step, setStep] = useState<"info" | "form" | "quiz" | "payment" | "success">("info")
  const [loading, setLoading] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [pendingEntry, setPendingEntry] = useState<any>(null)

  const [formData, setFormData] = useState({
    country: "",
    city: "",
    gender: "",
    dob: "",
    promoCode: "",
  })

  const [answers, setAnswers] = useState<Record<number, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmitForm = () => {
    if (!formData.country || !formData.city || !formData.gender || !formData.dob) {
      toast.error("Please fill in all required fields")
      return
    }
    setStep("quiz")
  }

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < 10) {
      toast.error("Please answer all 10 questions")
      return
    }

    try {
      const entryData = {
        ...formData,
        answers,
        status: "pending",
        paymentStatus: "pending",
        paymentAmount: 500, // KSh
        createdAt: new Date().toISOString(),
        score: 0, // Admin will score later
      }

      setPendingEntry(entryData)
      setShowPaymentDialog(true)
    } catch (error) {
      console.error("Error preparing entry:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handlePaymentSuccess = async () => {
    setLoading(true)
    try {
      const db = await getFirebaseDb()
      if (!db) throw new Error("Database not available")

      const finalEntry = {
        ...pendingEntry,
        paymentStatus: "completed",
        status: "approved",
      }

      await addDoc(collection(db, "couples_entries"), finalEntry)

      setShowPaymentDialog(false)
      setStep("success")
      toast.success("Entry submitted successfully!")
    } catch (error) {
      console.error("Error creating entry:", error)
      toast.error("Failed to submit entry")
    } finally {
      setLoading(false)
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-pink-950/30 dark:via-gray-950 dark:to-purple-950/30 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-pink-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Entry Submitted Successfully!
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Thank you for entering World Couple's Day 2026! You will receive a confirmation email shortly. Winners
              will be announced on August 15, 2026.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild>
                <Link href="/world-couples-day">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-pink-950/30 dark:via-gray-950 dark:to-purple-950/30">
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {step === "info" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 text-white overflow-hidden">
              <CardContent className="p-12 text-center">
                <Heart className="h-20 w-20 mx-auto mb-6" fill="currentColor" />
                <h1 className="text-5xl font-bold mb-4">World Couple's Day 2026</h1>
                <p className="text-2xl mb-2">August 15, 2026</p>
                <p className="text-xl text-pink-100 mb-8">
                  Celebrating Love & Partnership Worldwide
                </p>
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-pink-50 text-lg h-14 px-8"
                  onClick={() => setStep("form")}
                >
                  Enter Competition Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Details */}
            <div id="details" className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Trophy className="h-12 w-12 text-yellow-500 mb-4" />
                  <CardTitle>10 Winners</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Top 10 couples win free luxury hotel holidays at selected destinations worldwide
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="h-12 w-12 text-blue-500 mb-4" />
                  <CardTitle>Global Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Winners announced worldwide with media coverage and recognition
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Calendar className="h-12 w-12 text-green-500 mb-4" />
                  <CardTitle>Entry Fee</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-pink-600 mb-2">KSh 500</p>
                  <p className="text-muted-foreground">or USD 10</p>
                </CardContent>
              </Card>
            </div>

            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
                <CardDescription>
                  Answer all questions correctly for world's couple award winning day ceremony
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Must be in a committed relationship or marriage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Complete all 10 quiz questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Pay registration fee of KSh 500 / USD 10</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Winners selected based on quiz scores and story</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "form" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-pink-600" />
                Registration Form
              </CardTitle>
              <CardDescription>Tell us about yourselves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="e.g., Kenya"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    City/Town <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="e.g., Nairobi"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender (Couple) <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:border-pink-400 bg-white text-gray-900"
                  required
                >
                  <option value="" className="text-gray-900">Select couple gender</option>
                  <option value="Male & Female" className="text-gray-900">Male & Female</option>
                  <option value="Male & Male" className="text-gray-900">Male & Male</option>
                  <option value="Female & Female" className="text-gray-900">Female & Female</option>
                  <option value="Other" className="text-gray-900">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  required
                  className="text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                <Input
                  id="promoCode"
                  value={formData.promoCode}
                  onChange={(e) => handleInputChange("promoCode", e.target.value)}
                  placeholder="Enter promo code for discount"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep("info")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleSubmitForm} className="bg-pink-600 hover:bg-pink-700">
                  Continue to Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "quiz" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
                Quiz Questions
              </CardTitle>
              <CardDescription>Answer all 10 questions about your relationship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="space-y-3">
                  <Label className="text-base font-semibold">
                    {q.id}. {q.question}
                  </Label>
                  {q.type === "text" ? (
                    <Input
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Your answer"
                    />
                  ) : (
                    <RadioGroup value={answers[q.id]} onValueChange={(value) => handleAnswerChange(q.id, value)}>
                      <div className="space-y-2">
                        {q.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`q${q.id}-${idx}`} />
                            <Label htmlFor={`q${q.id}-${idx}`} className="font-normal cursor-pointer">
                              {String.fromCharCode(65 + idx)}. {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </div>
              ))}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep("form")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={loading || Object.keys(answers).length < 10}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* M-Pesa Payment Dialog */}
      {showPaymentDialog && pendingEntry && (
        <MpesaPaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          onSuccess={handlePaymentSuccess}
          serviceType="World Couple's Day Entry"
          actionType="Submit Entry"
          amount={500}
        />
      )}
    </div>
  )
}
