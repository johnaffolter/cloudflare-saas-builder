"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TestViewPage() {
  const params = useParams();
  const [tenantId, setTenantId] = useState("");
  const [orgId, setOrgId] = useState("");
  const [testResults, setTestResults] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleTest = async () => {
    setIsRunning(true);
    setTestResults(null);

    try {
      // Simulate test execution
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setTestResults(
        `Test completed successfully!\n\nParameters:\n- tenant_id: ${tenantId}\n- org_id: ${orgId}\n\nResults: View would return data based on these filters.`
      );
    } catch (error) {
      setTestResults(`Test failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen p-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="mb-8">
          <Link href={`/views/${params.id}`}>
            <Button variant="ghost" size="sm">
              ← Back to View
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Test View</h1>
          <p className="text-muted-foreground mt-2">
            Test your view with sample parameters
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Parameters</CardTitle>
              <CardDescription>
                Provide values for dynamic filters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant ID</Label>
                <Input
                  id="tenantId"
                  placeholder="123"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgId">Organization ID</Label>
                <Input
                  id="orgId"
                  placeholder="456"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                />
              </div>

              <Button
                onClick={handleTest}
                disabled={isRunning || !tenantId || !orgId}
              >
                {isRunning ? "Running Test..." : "Run Test"}
              </Button>
            </CardContent>
          </Card>

          {testResults && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                  {testResults}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
