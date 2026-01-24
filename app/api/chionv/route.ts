import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username ||
      !password
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const normalised = username.trim().toLowerCase();
    if (!normalised) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    const usersFile = path.join(dataDir, "users.json");
    let users: Record<string, string> = {};
    try {
      users = JSON.parse(await fs.readFile(usersFile, "utf8"));
    } catch {
      users = {};
    }
    if (users[normalised]) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 },
      );
    }
    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    users[normalised] = passwordHash;
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    const linksFile = path.join(dataDir, "links.json");
    let linksData: Record<string, any> = {};
    try {
      linksData = JSON.parse(await fs.readFile(linksFile, "utf8"));
    } catch {
      linksData = {};
    }
    const hasFlatEntries = Object.values(linksData).some(
      (v: any) => v && typeof v === "object" && "id" in v,
    );
    if (hasFlatEntries) {
      const migrated: Record<string, any> = {};
      migrated["global"] = linksData;
      migrated[normalised] = {};
      linksData = migrated;
    } else {
      if (!linksData[normalised]) {
        linksData[normalised] = {};
      }
    }
    await fs.writeFile(linksFile, JSON.stringify(linksData, null, 2));
    const res = NextResponse.json({ success: true });
    res.cookies.set("username", normalised, { path: "/" });
    return res;
  } catch (err) {
    console.error("POST /api/register error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
