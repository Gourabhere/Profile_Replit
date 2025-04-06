import { InsertCandidate } from "@shared/schema";

/**
 * Parse a CSV string into an array of objects
 * @param csv The CSV string to parse
 * @param headers If true, assumes the first row contains headers
 * @returns Array of objects with properties based on CSV columns
 */
export function parseCSV(csv: string, headers = true): Record<string, string>[] {
  const lines = csv.split("\n");
  const result: Record<string, string>[] = [];
  
  // Determine headers - either from the first row or generate default ones
  const headerRow = headers ? lines[0] : undefined;
  const columnHeaders = headerRow
    ? headerRow.split(",").map(header => header.trim())
    : Array.from({ length: lines[0].split(",").length }, (_, i) => `column${i + 1}`);
  
  // Start from the second row if headers are included
  const startRow = headers ? 1 : 0;
  
  // Process each data row
  for (let i = startRow; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(",").map(val => val.trim());
    const row: Record<string, string> = {};
    
    // Map values to column headers
    for (let j = 0; j < columnHeaders.length && j < values.length; j++) {
      row[columnHeaders[j]] = values[j];
    }
    
    result.push(row);
  }
  
  return result;
}

/**
 * Transform parsed CSV data into candidate objects
 * @param data The parsed CSV data
 * @param mapping Object mapping CSV columns to candidate fields
 * @returns Array of candidate objects ready for insertion
 */
export function transformToCandidate(
  data: Record<string, string>[],
  mapping: Record<keyof InsertCandidate, string>
): Partial<InsertCandidate>[] {
  return data.map(row => {
    const candidate: Partial<InsertCandidate> = {};
    
    // Map each field according to the provided mapping
    for (const [candidateField, csvColumn] of Object.entries(mapping)) {
      if (candidateField === 'skills' && row[csvColumn]) {
        // Handle skills as an array, splitting by semicolons
        candidate[candidateField as keyof InsertCandidate] = row[csvColumn]
          .split(';')
          .map(skill => skill.trim()) as any;
      } else if (candidateField === 'availableSince' && row[csvColumn]) {
        // Handle date conversion
        candidate[candidateField as keyof InsertCandidate] = new Date(row[csvColumn]) as any;
      } else if (row[csvColumn]) {
        candidate[candidateField as keyof InsertCandidate] = row[csvColumn] as any;
      }
    }
    
    return candidate;
  });
}
