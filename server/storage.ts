import {
  candidates, projects, savedCandidates, imports,
  type Candidate, type InsertCandidate,
  type Project, type InsertProject,
  type SavedCandidate, type InsertSavedCandidate,
  type Import, type InsertImport
} from "@shared/schema";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface IStorage {
  // Candidate operations
  getCandidates(): Promise<Candidate[]>;
  getCandidateById(id: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  createCandidates(candidates: InsertCandidate[]): Promise<Candidate[]>;
  searchCandidates(filters: CandidateFilter): Promise<Candidate[]>;

  // Project operations
  getProjectsByCandidateId(candidateId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  // Saved candidates operations
  getSavedCandidates(): Promise<SavedCandidate[]>;
  saveCandidate(savedCandidate: InsertSavedCandidate): Promise<SavedCandidate>;
  removeSavedCandidate(id: number): Promise<void>;

  // Import operations
  getImports(): Promise<Import[]>;
  createImport(importData: InsertImport): Promise<Import>;
  removeImport(id: number): Promise<void>; // Added removeImport
}

export interface CandidateFilter {
  skills?: string[];
  availability?: string[];
  minExperience?: number;
  maxExperience?: number;
  grades?: string[];
  locations?: string[];
  minUnallocatedDays?: number;
}

interface StoredData {
  candidates: Candidate[];
  projects: Project[];
  savedCandidates: SavedCandidate[];
  imports: Import[];
  candidateIdCounter: number;
  projectIdCounter: number;
  savedCandidateIdCounter: number;
  importIdCounter: number;
}

const dataFilePath = path.join(__dirname, 'data.json');

export class MemStorage implements IStorage {
  private candidatesData: Map<number, Candidate>;
  private projectsData: Map<number, Project>;
  private savedCandidatesData: Map<number, SavedCandidate>;
  private importsData: Map<number, Import>;
  private candidateIdCounter: number;
  private projectIdCounter: number;
  private savedCandidateIdCounter: number;
  private importIdCounter: number;

  constructor() {
    this.candidatesData = new Map();
    this.projectsData = new Map();
    this.savedCandidatesData = new Map();
    this.importsData = new Map();
    this.candidateIdCounter = 1;
    this.projectIdCounter = 1;
    this.savedCandidateIdCounter = 1;
    this.importIdCounter = 1;

    this.loadData();
  }

  private loadData() {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      const storedData: StoredData = JSON.parse(data);

      this.candidateIdCounter = storedData.candidateIdCounter;
      this.projectIdCounter = storedData.projectIdCounter;
      this.savedCandidateIdCounter = storedData.savedCandidateIdCounter;
      this.importIdCounter = storedData.importIdCounter;

      storedData.candidates.forEach(candidate => this.candidatesData.set(candidate.id, candidate));
      storedData.projects.forEach(project => this.projectsData.set(project.id, project));
      storedData.savedCandidates.forEach(savedCandidate => this.savedCandidatesData.set(savedCandidate.id, savedCandidate));
      storedData.imports.forEach(importItem => this.importsData.set(importItem.id, importItem));
    } catch (error: any) {
      // If the file doesn't exist or there's an error reading it, initialize with sample data
      if (error.code === 'ENOENT') {
        console.warn('Data file not found, initializing with sample data.');
      } else {
        console.warn('Error loading data from file:', error.message);
      }
      this.addSampleData();
      // Save the initial sample data
      this.saveData();
    }
  }

  private saveData() {
    try {
      const storedData: StoredData = {
        candidates: Array.from(this.candidatesData.values()),
        projects: Array.from(this.projectsData.values()),
        savedCandidates: Array.from(this.savedCandidatesData.values()),
        imports: Array.from(this.importsData.values()),
        candidateIdCounter: this.candidateIdCounter,
        projectIdCounter: this.projectIdCounter,
        savedCandidateIdCounter: this.savedCandidateIdCounter,
        importIdCounter: this.importIdCounter,
      };
      fs.writeFileSync(dataFilePath, JSON.stringify(storedData, null, 2));
    } catch (error: any) {
       console.error('Failed to save data:', error.message);
    }
  }

  private addSampleData() {
    // Sample candidates from the mockup
    const sampleCandidates: InsertCandidate[] = [
      {
        employeeId: "2519135",
        name: "Sandesh Birodkar",
        prefix: "Mr.",
        skills: ["TIBCO BW", "MuleSoft", "PL/SQL"],
        grade: "C4",
        experienceYears: "23.5",
        availability: "Available",
        unallocatedDays: 45,
        location: "Mumbai",
        phoneNumber: "+91 9876543210",
        email: "sandesh.birodkar@tcs.com",
        availableSince: new Date("2023-04-15")
      },
      // ... (other sample candidates)
    ];

    // Insert all sample candidates
    sampleCandidates.forEach(candidate => this.createCandidate(candidate));

    // Add sample projects for a candidate
    // ... (sample projects)

    // Add sample imports
    const sampleImports: InsertImport[] = [
      {
        filename: "Profile.xlsx",
        recordCount: 312,
        fileSize: "2 MB"
      },
      {
        filename: "TCS_Employees_Q1.csv",
        recordCount: 187,
        fileSize: "1.2 MB"
      }
    ];

    sampleImports.forEach(importData => this.createImport(importData));
     // Note: Don't call saveData here, let loadData handle the initial save if needed
  }

  // Candidate operations
  async getCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidatesData.values());
  }

  async getCandidateById(id: number): Promise<Candidate | undefined> {
    return this.candidatesData.get(id);
  }

  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const id = this.candidateIdCounter++;
    const newCandidate: Candidate = { ...candidate, id };
    this.candidatesData.set(id, newCandidate);
    this.saveData(); // Save after modification
    return newCandidate;
  }

  async createCandidates(candidates: InsertCandidate[]): Promise<Candidate[]> {
    const createdCandidates: Candidate[] = [];
    for (const candidate of candidates) {
      const id = this.candidateIdCounter++;
      const newCandidate: Candidate = { ...candidate, id };
      this.candidatesData.set(id, newCandidate);
      createdCandidates.push(newCandidate);
    }
    this.saveData(); // Save after modification
    return createdCandidates;
  }

  async searchCandidates(filters: CandidateFilter): Promise<Candidate[]> {
    let results = Array.from(this.candidatesData.values());

    // ... (filtering logic) ...

    return results;
  }

  // Project operations
  async getProjectsByCandidateId(candidateId: number): Promise<Project[]> {
    return Array.from(this.projectsData.values()).filter(
      project => project.candidateId === candidateId
    );
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const newProject: Project = { ...project, id };
    this.projectsData.set(id, newProject);
    this.saveData(); // Save after modification
    return newProject;
  }

  // Saved candidates operations
  async getSavedCandidates(): Promise<SavedCandidate[]> {
    return Array.from(this.savedCandidatesData.values());
  }

  async saveCandidate(savedCandidate: InsertSavedCandidate): Promise<SavedCandidate> {
    const id = this.savedCandidateIdCounter++;
    const newSavedCandidate: SavedCandidate = {
      ...savedCandidate,
      id,
      savedAt: new Date()
    };
    this.savedCandidatesData.set(id, newSavedCandidate);
    this.saveData(); // Save after modification
    return newSavedCandidate;
  }

  async removeSavedCandidate(id: number): Promise<void> {
    const deleted = this.savedCandidatesData.delete(id);
    if (deleted) {
       this.saveData(); // Save after modification
    }
  }

  // Import operations
  async getImports(): Promise<Import[]> {
    return Array.from(this.importsData.values());
  }

  async createImport(importData: InsertImport): Promise<Import> {
    const id = this.importIdCounter++;
    const newImport: Import = {
      ...importData,
      id,
      importedAt: new Date()
    };
    this.importsData.set(id, newImport);
    this.saveData(); // Save after modification
    return newImport;
  }

  // Added removeImport implementation
  async removeImport(id: number): Promise<void> {
    const deleted = this.importsData.delete(id);
    if (deleted) {
      this.saveData(); // Save after modification
    }
    // Consider adding error handling if the id doesn't exist
  }
}

export const storage = new MemStorage();
