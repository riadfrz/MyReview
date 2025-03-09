"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Lock,
  Info,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

// Define specific types for our API responses
interface ProofResult {
  success: boolean;
  proof: string;
}

interface SubmitReviewResult {
  success: boolean;
  txHash: string;
}

// Define type for review data
interface ReviewData {
  token: string;
  rating: number;
  reviewText: string;
  productName: string;
  proof: string | null;
}

// Mock function to validate token
const validateToken = (token: string) => {
  // In a real app, this would call an API or use a library to validate
  return token.length > 20;
};

// Mock function to generate ZKP
const generateProof = async () => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, proof: "zkp_proof_hash_example" });
    }, 2000);
  });
};

// Fix unused 'data' parameter and 'any' type issue
const submitReview = async (
  reviewData: ReviewData
): Promise<SubmitReviewResult> => {
  console.log("reviewData", reviewData);
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, txHash: "0x123456789abcdef" });
    }, 1500);
  });
};

export default function ReviewWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [productName, setProductName] = useState("");
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proof, setProof] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const steps = [
    { title: "Verify Purchase", description: "Enter your purchase token" },
    { title: "Write Review", description: "Share your experience" },
    { title: "Generate Proof", description: "Create a zero-knowledge proof" },
    { title: "Submit Review", description: "Send your verified review" },
  ];

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken(value);
    if (value) {
      setIsTokenValid(validateToken(value));
    } else {
      setIsTokenValid(null);
    }
  };

  const handleGenerateProof = async () => {
    setIsGeneratingProof(true);
    try {
      const result = (await generateProof()) as ProofResult;
      if (result.success) {
        setProof(result.proof);
      }
    } catch (error) {
      console.error("Error generating proof:", error);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitReview({
        token,
        rating,
        reviewText,
        productName,
        proof,
      });

      if (result.success) {
        setTxHash(result.txHash);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return !isTokenValid;
      case 1:
        return rating === 0 || !reviewText.trim();
      case 2:
        return !proof;
      default:
        return false;
    }
  };

  return (
    <Card className="w-full shadow-lg border-slate-200 dark:border-slate-800">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6" />
          <CardTitle>Verified Review System</CardTitle>
        </div>
        <CardDescription className="text-slate-100">
          Submit a private, verified review using zero-knowledge proofs
        </CardDescription>
      </CardHeader>

      <div className="px-6 pt-6">
        <Tabs value={currentStep.toString()} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            {steps.map((step, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                disabled={true}
                className={`${
                  index < currentStep
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : index === currentStep
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : ""
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <span className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs mr-1">
                    {index + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{step.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Enter Purchase Token</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Paste the purchase token you received after your purchase
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="token">Purchase Token</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">
                            Your purchase token was sent to you after completing
                            your purchase. It allows you to verify ownership
                            without revealing personal details.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="token"
                    placeholder="Paste your purchase token here"
                    value={token}
                    onChange={handleTokenChange}
                    className="font-mono"
                  />

                  {isTokenValid !== null && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isTokenValid
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isTokenValid ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Valid token</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span>Invalid token format</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-6">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-300">
                        Privacy Protected
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        Your purchase details remain private. We only verify
                        that you made a legitimate purchase without revealing
                        what you bought.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Write Your Review</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Share your honest experience with the product or service
                </p>

                <div className="space-y-2">
                  <Label htmlFor="product">
                    Product/Service Name (Optional)
                  </Label>
                  <Input
                    id="product"
                    placeholder="What did you purchase?"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${
                          rating >= star
                            ? "text-yellow-500"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                        onClick={() => setRating(star)}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review">Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Generate Zero-Knowledge Proof
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Create a cryptographic proof that verifies your purchase
                  without revealing details
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        What is a Zero-Knowledge Proof?
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        A zero-knowledge proof allows you to prove you made a
                        purchase without revealing any details about the
                        purchase itself. This protects your privacy while still
                        verifying you&apos;re a legitimate reviewer.
                      </p>
                    </div>
                  </div>
                </div>

                {!proof ? (
                  <Button
                    onClick={handleGenerateProof}
                    disabled={isGeneratingProof}
                    className="w-full"
                  >
                    {isGeneratingProof ? (
                      <>
                        <Spinner className="mr-2" />
                        Generating Proof...
                      </>
                    ) : (
                      <>Generate Proof</>
                    )}
                  </Button>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">
                        Proof Generated Successfully!
                      </span>
                    </div>
                    <div className="mt-2 bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                      <code className="text-xs font-mono break-all text-slate-800 dark:text-slate-300">
                        {proof}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Submit Your Verified Review
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your review will be submitted to the blockchain with your
                  zero-knowledge proof
                </p>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Review Summary</h4>

                  {productName && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Product/Service:
                      </span>
                      <span className="ml-2">{productName}</span>
                    </div>
                  )}

                  <div className="mb-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Rating:
                    </span>
                    <span className="ml-2 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            rating >= star
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Review:
                    </span>
                    <p className="mt-1 text-sm">{reviewText}</p>
                  </div>
                </div>

                {!isSubmitted ? (
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="mr-2" />
                        Submitting to Blockchain...
                      </>
                    ) : (
                      <>Submit Verified Review</>
                    )}
                  </Button>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">
                        Review Submitted Successfully!
                      </span>
                    </div>
                    {txHash && (
                      <div className="mt-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Transaction Hash:
                        </span>
                        <div className="mt-1 bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                          <code className="text-xs font-mono break-all text-slate-800 dark:text-slate-300">
                            {txHash}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep} disabled={isNextDisabled()}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <div /> // Empty div for spacing when on last step
        )}
      </CardFooter>
    </Card>
  );
}

// Label component
function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}

// Spinner component
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className || ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
