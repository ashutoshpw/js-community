/**
 * Admin Settings API Route
 *
 * GET: List all settings
 * PUT: Update settings
 */

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/database";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await db
      .select()
      .from(schema.siteSettings)
      .orderBy(schema.siteSettings.category, schema.siteSettings.name);

    // Group by category
    const groupedSettings = settings.reduce(
      (acc, setting) => {
        if (!acc[setting.category]) {
          acc[setting.category] = [];
        }
        acc[setting.category].push(setting);
        return acc;
      },
      {} as Record<string, typeof settings>,
    );

    return NextResponse.json({
      settings: groupedSettings,
      categories: Object.keys(groupedSettings),
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || !(await isUserAdmin(session.user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body as {
      settings: Array<{ name: string; value: string }>;
    };

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { error: "settings array is required" },
        { status: 400 },
      );
    }

    // Update each setting
    for (const { name, value } of settings) {
      await db
        .update(schema.siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(schema.siteSettings.name, name));
    }

    // Log admin action
    await db.insert(schema.adminActions).values({
      userId: Number(session.user.id),
      action: "settings_update",
      targetType: "setting",
      details: JSON.stringify({ updatedSettings: settings.map((s) => s.name) }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
