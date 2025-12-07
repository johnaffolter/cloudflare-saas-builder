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
import { useParams } from "next/navigation";

export default function PreviewPage() {
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
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-8">
          <Link href={`/views/${params.id}`}>
            <Button variant="ghost" size="sm">
              ← Back to View
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Preview View</h1>
          <p className="text-muted-foreground mt-2">
            Preview how your view will appear to end users
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{viewData.displayName}</CardTitle>
              <CardDescription>{viewData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm text-center text-muted-foreground">
                  Preview: Data would be displayed here based on the SQL query
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Sample Column 1</th>
                        <th className="text-left p-2">Sample Column 2</th>
                        <th className="text-left p-2">Sample Column 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Sample Data</td>
                        <td className="p-2">Sample Data</td>
                        <td className="p-2">Sample Data</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SQL Query</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {viewData.sqlDefinition}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
