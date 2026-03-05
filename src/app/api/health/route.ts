import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const health: {
    status: string;
    timestamp: string;
    services: {
      database: { status: string; latency?: number; error?: string };
    };
  } = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: { status: "unknown" },
    },
  };

  // Check database connection
  const start = Date.now();
  try {
    await query("SELECT 1");
    health.services.database = {
      status: "healthy",
      latency: Date.now() - start,
    };
  } catch (error) {
    health.services.database = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    health.status = "degraded";
  }

  const statusCode = health.status === "healthy" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
