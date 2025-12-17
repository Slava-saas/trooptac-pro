// app/cancel/confirm/page.tsx
import { Suspense } from "react";
import CancelConfirmClient from "./ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CancelConfirmPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Confirm cancellation</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Processing…</p>}>
            <CancelConfirmClient />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
