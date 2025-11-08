import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Claim } from "@/pages/FraudDashboard";
import { Image as ImageIcon, FileQuestion } from "lucide-react";

interface EvidenceViewerProps {
  claim: Claim;
}

export const EvidenceViewer = ({ claim }: EvidenceViewerProps) => {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-primary" />
          Evidence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Display */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
          {claim.evidence_url ? (
            <img
              src={claim.evidence_url}
              alt="Claim evidence"
              className="w-full h-full object-contain hover:scale-105 transition-transform cursor-zoom-in"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p class="text-sm">Failed to load image</p>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <FileQuestion className="h-16 w-16" />
              <p className="text-sm font-medium">No evidence image available</p>
            </div>
          )}
        </div>

        {/* Evidence Description */}
        {claim.evidence_description && (
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground mb-2">Evidence Description</p>
            <p className="text-sm text-muted-foreground">{claim.evidence_description}</p>
          </div>
        )}

        {!claim.evidence_description && claim.evidence_url && (
          <p className="text-sm text-muted-foreground text-center">No description provided</p>
        )}
      </CardContent>
    </Card>
  );
};
