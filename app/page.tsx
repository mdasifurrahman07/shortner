import fs from "fs/promises";
import path from "path";
import Table from "./components/Table";
import Header from "./components/Header";
import { cookies } from "next/headers";

export default async function HomePage() {
  const username = (await cookies()).get("username")?.value;
  if (!username) {
    return (
      <>
        <style>{`
          body {
            background: #ffffff !important;
            background-image: none !important;
            color: #0f172a;
          }
        `}</style>
        <div className="min-h-screen bg-white"></div>
      </>
    );
  }

  const filePath = path.join(process.cwd(), "data", "links.json");
  let linksData: Record<string, any> = {};
  try {
    const json = await fs.readFile(filePath, "utf8");
    linksData = JSON.parse(json);
  } catch {
    linksData = {};
  }

  const hasFlatEntries = Object.values(linksData).some(
    (v: any) => v && typeof v === "object" && "id" in v,
  );
  let initialLinks: any[] = [];
  if (hasFlatEntries) {
    initialLinks = Object.values(linksData);
  } else {
    const userEntries = linksData[username] ?? {};
    initialLinks = Object.values(userEntries);
  }

  return (
    <>
      <style>{`
        body {
          background: #ffffff !important;
          background-image: none !important;
          color: #0f172a;
        }
      `}</style>
      <div className="min-h-screen bg-white text-slate-900">
        <Header initialUsername={username} />
        <Table initialLinks={initialLinks} />
      </div>
    </>
  );
}
