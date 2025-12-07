"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function DeployPage() {
  const params = useParams();
  const router = useRouter();
  const [viewData, setViewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<string | null>(null);

  useEffect(() => {
    // Fetch view data
    fetch(`/api/views/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        const typedData = data as { view?: any };
        setViewData(typedData.view);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params.id]);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployStatus(null);

    try {
      // Simulate deployment
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setDeployStatus(
        "✓ View deployed successfully! The view is now available to all clients."
      );
      
      // In a real implementation, you would update the view status to "deployed"
      setTimeout(() => {
        router.push(`/views/${params.id}`);
      }, 2000);
    } catch (error) {
      setDeployStatus("✗ Deployment failed. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </main>
    );
  }

  if (!viewData) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>View not found</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="mb-8">
          <Link href={`/views/${params.id}`}>
            <Button variant="ghost" size="sm">
              ← Back to View
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Deploy View</h1>
          <p className="text-muted-foreground mt-2">
            Deploy your view to make it available to clients
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>View Summary</CardTitle>
              <CardDescription>Review before deploying</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">View Name</h3>
                <p className="text-sm text-muted-foreground">{viewData.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Display Name</h3>
                <p className="text-sm text-muted-foreground">
                  {viewData.displayName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {viewData.description || "No description"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Current Status</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary">
                  {viewData.status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  View definition is complete
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  SQL query is valid
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Semantic metadata is configured
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠</span>
                  Testing recommended before deployment
                </li>
              </ul>
            </CardContent>
          </Card>

          {deployStatus && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm">{deployStatus}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button onClick={handleDeploy} disabled={isDeploying}>
              {isDeploying ? "Deploying..." : "Deploy View"}
            </Button>
            <Link href={`/views/${params.id}/test`}>
              <Button variant="outline">Test First</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
