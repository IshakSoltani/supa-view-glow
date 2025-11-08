import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClaimSelector } from "@/components/ClaimSelector";
import { ClaimDetailsCard } from "@/components/ClaimDetailsCard";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { EvidenceViewer } from "@/components/EvidenceViewer";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, DollarSign, Clock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import jessicaLogo from "@/assets/jessica-logo.png";

export interface Claim {
  claim_id: number;
  "Customer Name": string;
  "Policy ID": string;
  "Date Reported": string;
  "Incident Date": string;
  "Incident Type": string;
  Description: string;
  Location: string;
  Status: string;
  "Estimated Damage": number;
  "Approved Amount": number;
  claim_prediction: string;
  elevenlabs_transcript: string;
  "Agent Notes": string;
  evidence_url: string;
  evidence_description: string;
  "evidence_ai-score": string;
  evidence_classification: string;
}

const FraudDashboard = () => {
  const [selectedClaimId, setSelectedClaimId] = useState<number | null>(null);
  const [claimDetails, setClaimDetails] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedClaimId) {
      fetchClaimDetails(selectedClaimId);
    }
  }, [selectedClaimId]);

  const fetchClaimDetails = async (claimId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("claims_table")
        .select("*")
        .eq("claim_id", claimId)
        .maybeSingle();

      if (error) throw error;
      setClaimDetails(data);
    } catch (error) {
      console.error("Error fetching claim details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("approved") || statusLower.includes("paid")) return "bg-success text-success-foreground";
    if (statusLower.includes("pending") || statusLower.includes("review")) return "bg-warning text-warning-foreground";
    if (statusLower.includes("denied") || statusLower.includes("flagged")) return "bg-destructive text-destructive-foreground";
    return "bg-muted text-muted-foreground";
  };

  const calculateDaysSince = (dateString: string) => {
    if (!dateString) return "N/A";
    const reportDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - reportDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img src={jessicaLogo} alt="Jessica Logo" className="h-12" />
          <h1 className="text-3xl font-bold text-foreground">Insurance Fraud Analyst Dashboard</h1>
        </div>

        {/* Claim Selector */}
        <ClaimSelector onClaimSelect={setSelectedClaimId} selectedClaimId={selectedClaimId} />

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : claimDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <Badge className={getStatusColor(claimDetails.Status)}>
                {claimDetails.Status || "Unknown"}
              </Badge>
            </div>

            <StatCard
              title="AI Fraud Score"
              value={claimDetails["evidence_ai-score"] || "N/A"}
              icon={TrendingUp}
              description="Risk assessment"
            />

            <StatCard
              title="Financial Delta"
              value={`$${Math.abs((claimDetails["Estimated Damage"] || 0) - (claimDetails["Approved Amount"] || 0)).toLocaleString()}`}
              icon={DollarSign}
              description="Estimated vs Approved"
            />

            <StatCard
              title="Days Since Report"
              value={calculateDaysSince(claimDetails["Date Reported"])}
              icon={Clock}
              description="Time elapsed"
            />
          </div>
        ) : (
          <div className="text-center p-12 bg-muted/30 rounded-lg border border-border">
            <img src={jessicaLogo} alt="Jessica Logo" className="h-16 mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">Select a claim to view details</p>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        ) : claimDetails ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EvidenceViewer claim={claimDetails} />
              <AIAnalysisPanel claim={claimDetails} />
            </div>
            <ClaimDetailsCard claim={claimDetails} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FraudDashboard;
