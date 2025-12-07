import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { views } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const runtime = "edge";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ViewDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const view = await db
    .select()
    .from(views)
    .where(eq(views.id, params.id))
    .limit(1);

  if (!view || view.length === 0) {
    notFound();
  }

  const viewData = view[0];
  let semanticMetadata = null;
  try {
    semanticMetadata = viewData.semanticMetadata
      ? JSON.parse(viewData.semanticMetadata)
      : null;
  } catch (e) {
    console.error("Failed to parse semantic metadata:", e);
  }

  return (
    <main className="flex flex-col min-h-screen p-8">
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-8">
          <Link href="/views">
            <Button variant="ghost" size="sm">
              ← Back to Views
            </Button>
          </Link>
          <div className="flex justify-between items-start mt-4">
            <div>
              <h1 className="text-3xl font-bold">{viewData.displayName}</h1>
              <p className="text-muted-foreground mt-2">{viewData.name}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary">
              {viewData.status}
            </span>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Build, test, and deploy your view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link href={`/views/${params.id}/builder`}>
                  <Button variant="outline">Builder</Button>
                </Link>
                <Link href={`/views/${params.id}/preview`}>
                  <Button variant="outline">Preview</Button>
                </Link>
                <Link href={`/views/${params.id}/test`}>
                  <Button variant="outline">Test</Button>
                </Link>
                <Link href={`/views/${params.id}/deploy`}>
                  <Button>Deploy</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* View Definition */}
          <Card>
            <CardHeader>
              <CardTitle>View Definition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {viewData.description || "No description provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Semantic Metadata */}
          {semanticMetadata && (
            <Card>
              <CardHeader>
                <CardTitle>Semantic Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {semanticMetadata.identifiers &&
                  semanticMetadata.identifiers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Identifiers</h3>
                      <div className="flex flex-wrap gap-2">
                        {semanticMetadata.identifiers.map((id: string) => (
                          <span
                            key={id}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                          >
                            {id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {semanticMetadata.metrics &&
                  semanticMetadata.metrics.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Metrics</h3>
                      <div className="flex flex-wrap gap-2">
                        {semanticMetadata.metrics.map((metric: string) => (
                          <span
                            key={metric}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {semanticMetadata.attributes &&
                  semanticMetadata.attributes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Attributes</h3>
                      <div className="flex flex-wrap gap-2">
                        {semanticMetadata.attributes.map((attr: string) => (
                          <span
                            key={attr}
                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs"
                          >
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

          {/* SQL Definition */}
          <Card>
            <CardHeader>
              <CardTitle>SQL Definition</CardTitle>
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
