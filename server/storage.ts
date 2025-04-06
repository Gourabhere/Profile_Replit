import { 
  candidates, projects, savedCandidates, imports,
  type Candidate, type InsertCandidate,
  type Project, type InsertProject,
  type SavedCandidate, type InsertSavedCandidate,
  type Import, type InsertImport
} from "@shared/schema";

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
    
    // Add sample data
    this.addSampleData();
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
      {
        employeeId: "1852367",
        name: "Simi Jain",
        prefix: "Ms.",
        skills: ["IoT", "Python", "Cloud Computing"],
        grade: "C3A",
        experienceYears: "11.7",
        availability: "Available-ESU Skill",
        unallocatedDays: 30,
        location: "Bangalore",
        phoneNumber: "+91 9765432180",
        email: "simi.jain@tcs.com",
        availableSince: new Date("2023-03-20")
      },
      {
        employeeId: "3214598",
        name: "Dineshsakthi M",
        prefix: "Mr.",
        skills: ["Generative AI"],
        grade: "C1",
        experienceYears: "0.36",
        availability: "Fresh Trainee-Available",
        unallocatedDays: 90,
        location: "Chennai",
        phoneNumber: "+91 9854321670",
        email: "dineshsakthi.m@tcs.com",
        availableSince: new Date("2023-06-01")
      },
      {
        employeeId: "2647893",
        name: "Harsh Prajapati",
        prefix: "Mr.",
        skills: ["SAP Fiori dev", "MYSQL", "Python", "Core Java"],
        grade: "C1Y",
        experienceYears: "1.42",
        availability: "Available-ESU Skill",
        unallocatedDays: 67,
        location: "Ahmedabad",
        phoneNumber: "+91 9723501281",
        email: "harsh.prajapati@tcs.com",
        availableSince: new Date("2023-03-15")
      },
      {
        employeeId: "1936547",
        name: "Sagar Barot",
        prefix: "Mr.",
        skills: ["SAP ABAP"],
        grade: "Y",
        experienceYears: "0.61",
        availability: "Available",
        unallocatedDays: 133,
        location: "Ahmedabad",
        phoneNumber: "+91 9632587410",
        email: "sagar.barot@tcs.com",
        availableSince: new Date("2023-02-10")
      },
      {
        employeeId: "2713648",
        name: "Kiran T",
        prefix: "Mr.",
        skills: ["Salesforce admin", "SAP Hana"],
        grade: "C1Y",
        experienceYears: "2.87",
        availability: "Available",
        unallocatedDays: 428,
        location: "Bangalore",
        phoneNumber: "+91 9517532648",
        email: "kiran.t@tcs.com",
        availableSince: new Date("2023-01-05")
      },
      {
        employeeId: "1425789",
        name: "Vaishnavi Gajanan Bramhankar",
        prefix: "Ms.",
        skills: ["Salesforce admin", "service cloud"],
        grade: "C1",
        experienceYears: "3.05",
        availability: "Available",
        unallocatedDays: 112,
        location: "Nagpur",
        phoneNumber: "+91 9874563210",
        email: "vaishnavi.bramhankar@tcs.com",
        availableSince: new Date("2023-02-28")
      }
    ];

    // Insert all sample candidates
    sampleCandidates.forEach(candidate => this.createCandidate(candidate));

    // Add sample projects for a candidate
    const projectsForHarsh: InsertProject[] = [
      {
        candidateId: 4, // Assuming Harsh has ID 4
        name: "TCS SAP Migration Project",
        role: "SAP Fiori Developer",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2023-03-15")
      },
      {
        candidateId: 4,
        name: "TCS Onboarding",
        role: "Trainee",
        startDate: new Date("2021-10-01"),
        endDate: new Date("2021-12-31")
      }
    ];

    projectsForHarsh.forEach(project => this.createProject(project));

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
    return newCandidate;
  }

  async createCandidates(candidates: InsertCandidate[]): Promise<Candidate[]> {
    const createdCandidates: Candidate[] = [];
    for (const candidate of candidates) {
      const createdCandidate = await this.createCandidate(candidate);
      createdCandidates.push(createdCandidate);
    }
    return createdCandidates;
  }

  async searchCandidates(filters: CandidateFilter): Promise<Candidate[]> {
    let results = Array.from(this.candidatesData.values());

    // Filter by skills
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(candidate => 
        filters.skills!.some(skill => 
          candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Filter by availability
    if (filters.availability && filters.availability.length > 0) {
      results = results.filter(candidate => 
        filters.availability!.includes(candidate.availability)
      );
    }

    // Filter by experience range
    if (filters.minExperience !== undefined) {
      results = results.filter(candidate => 
        parseFloat(candidate.experienceYears) >= filters.minExperience!
      );
    }
    if (filters.maxExperience !== undefined) {
      results = results.filter(candidate => 
        parseFloat(candidate.experienceYears) <= filters.maxExperience!
      );
    }

    // Filter by grades
    if (filters.grades && filters.grades.length > 0) {
      results = results.filter(candidate => 
        filters.grades!.includes(candidate.grade)
      );
    }

    // Filter by locations
    if (filters.locations && filters.locations.length > 0) {
      results = results.filter(candidate => 
        filters.locations!.some(location => 
          candidate.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    // Filter by minimum unallocated days
    if (filters.minUnallocatedDays !== undefined) {
      results = results.filter(candidate => 
        candidate.unallocatedDays >= filters.minUnallocatedDays!
      );
    }

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
    return newSavedCandidate;
  }

  async removeSavedCandidate(id: number): Promise<void> {
    this.savedCandidatesData.delete(id);
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
    return newImport;
  }
}

export const storage = new MemStorage();
