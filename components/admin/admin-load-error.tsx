function describe(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

/** Admin-only: shows why data failed to load instead of the generic error page. */
export function AdminLoadError({ error }: { error: unknown }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-destructive/40 bg-card p-6" role="alert">
        <h1 className="text-h3 font-semibold text-foreground">Couldn&apos;t load orders</h1>
        <p className="mt-2 text-small text-muted-foreground">
          The database didn&apos;t respond as expected. Check the Supabase project is active and that
          SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set for this deployment.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-3 text-caption text-foreground">
          {describe(error)}
        </pre>
      </div>
    </div>
  );
}
