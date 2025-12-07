"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface SemanticMetadata {
  identifiers: string[];
  metrics: string[];
  attributes: string[];
}

export default function CreateViewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    sqlDefinition: "",
    identifiers: "",
    metrics: "",
    attributes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const semanticMetadata: SemanticMetadata = {
        identifiers: formData.identifiers
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        metrics: formData.metrics
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        attributes: formData.attributes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/views", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          displayName: formData.displayName,
          description: formData.description,
          sqlDefinition: formData.sqlDefinition,
          semanticMetadata,
        }),
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error || "Failed to create view");
      }

      const data = await response.json() as { view: { id: string } };
      router.push(`/views/${data.view.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen p-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="mb-8">
          <Link href="/views">
            <Button variant="ghost" size="sm">
              ← Back to Views
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Create New View</h1>
          <p className="text-muted-foreground mt-2">
            Build, test, and deploy views for clients and their sub-clients
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>View Definition</CardTitle>
              <CardDescription>
                Basic information about your view
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">View Name</Label>
                <Input
                  id="name"
                  placeholder="vw_daily_sales"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Technical name used in the database
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Daily Sales Summary"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Human-readable name shown to users
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What this view provides..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Describe the purpose and contents of this view
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Super Admin Only
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Only users with super admin privileges can create and manage
                  views
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Semantic Metadata</CardTitle>
              <CardDescription>
                Define the data structure and categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifiers">Identifiers</Label>
                <Input
                  id="identifiers"
                  placeholder="restaurant_guid, metric_date"
                  value={formData.identifiers}
                  onChange={(e) =>
                    setFormData({ ...formData, identifiers: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of identifier fields
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metrics">Metrics</Label>
                <Input
                  id="metrics"
                  placeholder="gross_sales, net_sales, order_count"
                  value={formData.metrics}
                  onChange={(e) =>
                    setFormData({ ...formData, metrics: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of metric fields
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attributes">Attributes</Label>
                <Input
                  id="attributes"
                  placeholder="restaurant_name, location, day_of_week"
                  value={formData.attributes}
                  onChange={(e) =>
                    setFormData({ ...formData, attributes: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of attribute fields
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SQL Definition</CardTitle>
              <CardDescription>
                Write the SQL query. Use {"{tenant_id}"} and {"{org_id}"} for
                dynamic filters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="sqlDefinition">SQL Query</Label>
                <Textarea
                  id="sqlDefinition"
                  placeholder={`SELECT 
  restaurant_guid,
  DATE(order_timestamp) as metric_date,
  SUM(total_amount) as gross_sales,
  SUM(net_amount) as net_sales,
  COUNT(*) as order_count,
  restaurant_name,
  location,
  strftime('%w', order_timestamp) as day_of_week
FROM orders
WHERE tenant_id = {tenant_id}
  AND org_id = {org_id}
GROUP BY restaurant_guid, metric_date`}
                  value={formData.sqlDefinition}
                  onChange={(e) =>
                    setFormData({ ...formData, sqlDefinition: e.target.value })
                  }
                  rows={12}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use <code className="bg-muted px-1 py-0.5 rounded">
                    {"{tenant_id}"}
                  </code>{" "}
                  and{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    {"{org_id}"}
                  </code>{" "}
                  placeholders for dynamic filtering
                </p>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create View"}
            </Button>
            <Link href="/views">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
