import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { views } from "@/server/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const runtime = "edge";

export default async function ViewsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // TODO: Check user role from database
  const userRole = "super_admin"; // For now, hardcoded

  if (userRole !== "super_admin") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Only super admins can access view management.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const allViews = await db.select().from(views);

  return (
    <main className="flex flex-col min-h-screen p-8">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">View Management</h1>
            <p className="text-muted-foreground mt-2">
              Build, test, and deploy views for clients and their sub-clients
            </p>
          </div>
          <Link href="/views/create">
            <Button>Create New View</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {allViews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground mb-4">No views created yet</p>
                <Link href="/views/create">
                  <Button>Create Your First View</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            allViews.map((view) => (
              <Card key={view.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{view.displayName}</CardTitle>
                      <CardDescription className="mt-1">
                        {view.name}
                      </CardDescription>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary">
                      {view.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {view.description || "No description provided"}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/views/${view.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                    <Link href={`/views/${view.id}/test`}>
                      <Button variant="outline" size="sm">Test</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
