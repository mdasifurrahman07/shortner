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
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    const usersFile = path.join(dataDir, "users.json");
    let users: Record<string, string> = {};
    try {
      users = JSON.parse(await fs.readFile(usersFile, "utf8"));
    } catch {
      users = {};
    }
    const storedHash = users[normalised];
    if (!storedHash) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }
    const providedHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    if (providedHash !== storedHash) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }
    const res = NextResponse.json({ success: true });
    res.cookies.set("username", normalised, { path: "/" });
    return res;
  } catch (err) {
    console.error("POST /api/login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
