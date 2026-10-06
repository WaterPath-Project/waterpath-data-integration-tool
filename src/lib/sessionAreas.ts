import api from "@/api";

/**
 * Splits one CSV line, honouring double-quoted fields (e.g. "Korea, Republic of").
 */
function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

/** Unique, non-empty values of the `gid` column of a CSV document, in order of appearance. */
export function parseGidColumn(csv: string): string[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];
  const header = splitCsvLine(lines[0]).map((cell) => cell.toLowerCase());
  const gidIndex = header.indexOf("gid");
  if (gidIndex === -1) return [];
  const gids = new Set<string>();
  for (const line of lines.slice(1)) {
    const gid = splitCsvLine(line)[gidIndex];
    if (gid) gids.add(gid);
  }
  return Array.from(gids);
}

/**
 * GADM ids a session was generated for, recovered from the server.
 *
 * The session endpoint only lists file names, so when the store is empty (page refresh,
 * or a session opened directly by URL) the ids are read from the `gid` column of the
 * session's population file, which is always generated and has one row per area.
 */
export async function fetchSessionAreaGids(sessionId: string): Promise<string[]> {
  const params = new URLSearchParams({ session_id: sessionId, file_id: "population" });
  const result = await api.get<string>(
    `/api/data/input/download?${params.toString()}`,
    { responseType: "text" },
  );
  return parseGidColumn(result.data);
}
