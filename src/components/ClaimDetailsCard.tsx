import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Claim } from "@/pages/FraudDashboard";
import { Calendar, MapPin, FileText, DollarSign, User, CreditCard } from "lucide-react";

interface ClaimDetailsCardProps {
  claim: Claim;
}

export const ClaimDetailsCard = ({ claim }: ClaimDetailsCardProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Claim Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Incident Information */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Incident Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Type</p>
                <p className="text-sm text-muted-foreground">{claim["Incident Type"] || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Incident Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(claim["Incident Date"])}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">{claim.Location || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Date Reported</p>
                <p className="text-sm text-muted-foreground">{formatDate(claim["Date Reported"])}</p>
              </div>
            </div>
          </div>
          {claim.Description && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground mb-1">Description</p>
              <p className="text-sm text-muted-foreground">{claim.Description}</p>
            </div>
          )}
        </div>

        {/* Financial Details */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Financial Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Estimated Damage</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(claim["Estimated Damage"])}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Approved Amount</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(claim["Approved Amount"])}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Information */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Policy Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Customer Name</p>
                <p className="text-sm text-muted-foreground">{claim["Customer Name"] || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Policy ID</p>
                <p className="text-sm text-muted-foreground">{claim["Policy ID"] || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
