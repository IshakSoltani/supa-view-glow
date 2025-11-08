import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Claim } from "@/pages/FraudDashboard";
import { Brain, Shield, FileText, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface AIAnalysisPanelProps {
  claim: Claim;
}

export const AIAnalysisPanel = ({ claim }: AIAnalysisPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const getScoreValue = (score: string): number => {
    if (!score) return 0;
    const numericScore = parseFloat(score);
    return isNaN(numericScore) ? 0 : numericScore * 100;
  };

  const getScoreColor = (score: string): string => {
    const numericScore = parseFloat(score);
    if (isNaN(numericScore)) return "bg-muted text-muted-foreground";
    
    if (numericScore <= 0.3) return "bg-success text-success-foreground";
    if (numericScore <= 0.7) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const getRiskLevel = (score: string): string => {
    const numericScore = parseFloat(score);
    if (isNaN(numericScore)) return "Unknown";
    
    if (numericScore <= 0.3) return "Low Risk";
    if (numericScore <= 0.7) return "Medium Risk";
    return "High Risk";
  };

  const scoreValue = getScoreValue(claim["evidence_ai-score"]);

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          AI Fraud Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Fraud Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Fraud Detection Score</span>
            </div>
            <Badge className={getScoreColor(claim["evidence_ai-score"])}>
              {getRiskLevel(claim["evidence_ai-score"])}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Risk Level</span>
              <span className="font-bold text-foreground">
                {claim["evidence_ai-score"] || "N/A"}
              </span>
            </div>
            <Progress value={scoreValue} className="h-3" />
          </div>
        </div>

        {/* Evidence Classification */}
        {claim.evidence_classification && (
          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Evidence Classification</span>
            </div>
            <p className="text-sm text-muted-foreground">{claim.evidence_classification}</p>
          </div>
        )}

        {/* AI Prediction */}
        {claim.claim_prediction && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-2">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-0 hover:bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">AI Prediction Summary</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="animate-accordion-down">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap pt-2">
                  {claim.claim_prediction}
                </p>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* Transcript */}
        {claim.elevenlabs_transcript && (
          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Call Transcript</span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
              {claim.elevenlabs_transcript}
            </p>
          </div>
        )}

        {/* Agent Notes */}
        {claim["Agent Notes"] && (
          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Agent Notes</span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {claim["Agent Notes"]}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
