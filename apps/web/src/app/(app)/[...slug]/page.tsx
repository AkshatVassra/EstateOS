import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CustomRoutePage() {
  return (
    <>
      <PageHeader 
        title="Custom Agency Module Sandbox" 
        description="This custom route is reserved for specialized agency workflows and proprietary third-party integrations." 
      />
      <PageBody>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-border rounded-2xl bg-gradient-to-br from-card to-muted/20 p-8 shadow-sm">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center mb-6 text-primary shadow-sm">
            <Compass className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Custom Workflow Sandbox</h2>
          <p className="text-muted-foreground max-w-md mb-8 text-sm">
            You have accessed a dynamic module sandbox. All core 12 modules of EstateOS are active and fully operational in your navigation sidebar.
          </p>
          <div className="flex gap-4">
            <Link href="/command-center">
              <Button variant="default" className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Return to Command Center</span>
              </Button>
            </Link>
          </div>
        </div>
      </PageBody>
    </>
  );
}
