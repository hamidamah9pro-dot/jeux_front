import { Suspense } from "react";
import { Backdrop, Spinner } from "@/components/ui";
import  GameHub  from "@/components/game/GameHub";

function Loading() {
  return (
    <main className="grid min-h-screen place-items-center">
      <Backdrop />
      <Spinner className="h-10 w-10" />
    </main>
  );
}

async function Hub({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <GameHub code={code.toUpperCase()} />;
}

export default function GamePage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <Hub params={params} />
    </Suspense>
  );
}