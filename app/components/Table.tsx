"use client";

import { useEffect, useState } from "react";
import AddUrlButton from "./AddUrlButton";

interface LinkEntry {
  id: string;
  image: string;
  urlMobile: string;
  urlDesktop?: string;
}

interface TableProps {
  initialLinks: LinkEntry[];
}

export default function Table({ initialLinks }: TableProps) {
  const [links, setLinks] = useState<LinkEntry[]>(initialLinks);
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        // data is an object keyed by id; convert to array
        const arr: LinkEntry[] = Object.values(data);
        setLinks(arr);
      } else if (res.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreated = () => {
    fetchLinks();
  };

  const filtered = links.filter((link) =>
    link.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-800 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tighter text-cyan-400 border-l-4 border-cyan-500 pl-3">
            Your Links
          </h1>
          <AddUrlButton onCreated={handleCreated} />
        </div>
        {/* Search input */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search Image"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-600 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-700 text-white shadow-sm"
          />
        </div>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  Image Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  Mobile Url
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  Desktop Url
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  Short Url
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-slate-400"
                  >
                    No entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((link, idx) => (
                  <tr
                    key={link.id}
                    className="hover:bg-slate-700 odd:bg-slate-800 even:bg-slate-750 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-100">
                      {link.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-cyan-400">
                      <a
                        href={link.urlMobile}
                        className="underline hover:text-cyan-300"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.urlMobile}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-cyan-400">
                      {link.urlDesktop ? (
                        <a
                          href={link.urlDesktop}
                          className="underline hover:text-cyan-300"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.urlDesktop}
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-cyan-400">
                      <a
                        href={`/${link.id}`}
                        className="underline hover:text-cyan-300"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {origin ? `${origin}/${link.id}` : `/${link.id}`}
                      </a>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-400">
                      <button
                        onClick={async () => {
                          const confirmed = window.confirm(
                            `Delete entry ${link.id}?`,
                          );
                          if (!confirmed) return;
                          try {
                            const res = await fetch(`/api/delete/${link.id}`, {
                              method: "DELETE",
                            });
                            if (res.ok) {
                              // Optimistically update local state
                              setLinks((prev) =>
                                prev.filter((item) => item.id !== link.id),
                              );
                              // Then re-fetch to ensure consistency
                              await fetchLinks();
                            } else {
                              console.error("Failed to delete");
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="underline hover:text-red-700 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
