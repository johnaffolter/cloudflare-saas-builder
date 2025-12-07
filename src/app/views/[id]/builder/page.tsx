"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BuilderPage() {
  const params = useParams();
  const [viewData, setViewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          <h1 className="text-3xl font-bold mt-4">View Builder</h1>
          <p className="text-muted-foreground mt-2">
            Edit and configure your view
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>View Configuration</CardTitle>
              <CardDescription>
                Modify your view definition and SQL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>View Name</Label>
                <Input value={viewData.name} disabled />
              </div>

              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={viewData.displayName} disabled />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={viewData.description || ""} disabled rows={3} />
              </div>

              <div className="space-y-2">
                <Label>SQL Definition</Label>
                <Textarea
                  value={viewData.sqlDefinition}
                  disabled
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Builder Mode
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Use this interface to modify and rebuild your view. Changes are
                  saved as drafts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
