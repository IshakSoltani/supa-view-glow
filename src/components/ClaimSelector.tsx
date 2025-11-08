import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ClaimSummary {
  claim_id: number;
  "Customer Name": string;
  Status: string;
  "Date Reported": string;
}

interface ClaimSelectorProps {
  onClaimSelect: (claimId: number) => void;
  selectedClaimId: number | null;
}

export const ClaimSelector = ({ onClaimSelect, selectedClaimId }: ClaimSelectorProps) => {
  const [claims, setClaims] = useState<ClaimSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from("claims_table")
        .select(`
          claim_id,
          "Customer Name",
          Status,
          "Date Reported"
        `)
        .order("claim_id", { ascending: true });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("fraudulent")) return "destructive";
    if (statusLower.includes("uncertain")) return "secondary";
    if (statusLower.includes("valid")) return "default";
    return "outline";
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-foreground mb-2 block">
        Select Claim
      </label>
      <Select
        value={selectedClaimId?.toString()}
        onValueChange={(value) => onClaimSelect(Number(value))}
        disabled={loading}
      >
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder={loading ? "Loading claims..." : "Choose a claim to analyze"} />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border max-h-80">
          {claims.map((claim) => (
            <SelectItem
              key={claim.claim_id}
              value={claim.claim_id.toString()}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full gap-3">
                <span className="font-medium">Claim #{claim.claim_id}</span>
                <span className="text-muted-foreground">
                  {claim["Customer Name"] || "Unknown"}
                </span>
                <Badge variant={getStatusBadgeColor(claim.Status)} className="ml-auto">
                  {claim.Status || "N/A"}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
