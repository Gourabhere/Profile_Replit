import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCandidateSchema, insertImportSchema, insertProjectSchema, insertSavedCandidateSchema } from "@shared/schema";

// Basic validation helper
function validateRequest<T>(schema: z.ZodSchema<T>, req: Request, res: Response): T | null {
  try {
    return schema.parse(req.body);
  } catch (error) {
    res.status(400).json({ message: "Invalid request data", error });
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all candidates
  app.get("/api/candidates", async (_req, res) => {
    try {
      const candidates = await storage.getCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidates", error });
    }
  });

  // GET single candidate by ID
  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid candidate ID" });
      }
      
      const candidate = await storage.getCandidateById(id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidate", error });
    }
  });

  // POST create a new candidate
  app.post("/api/candidates", async (req, res) => {
    const data = validateRequest(insertCandidateSchema, req, res);
    if (!data) return;
    
    try {
      const candidate = await storage.createCandidate(data);
      res.status(201).json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to create candidate", error });
    }
  });

  // POST create multiple candidates (bulk upload)
  app.post("/api/candidates/bulk", async (req, res) => {
    try {
      const candidatesData = req.body;
      if (!Array.isArray(candidatesData)) {
        return res.status(400).json({ message: "Expected an array of candidates" });
      }
      
      const candidates = await storage.createCandidates(candidatesData);
      res.status(201).json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to create candidates", error });
    }
  });

  // POST search candidates with filters
  app.post("/api/candidates/search", async (req, res) => {
    try {
      const filters = req.body;
      const candidates = await storage.searchCandidates(filters);
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to search candidates", error });
    }
  });

  // GET projects for a candidate
  app.get("/api/candidates/:id/projects", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      if (isNaN(candidateId)) {
        return res.status(400).json({ message: "Invalid candidate ID" });
      }
      
      const projects = await storage.getProjectsByCandidateId(candidateId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects", error });
    }
  });

  // POST create a new project
  app.post("/api/projects", async (req, res) => {
    const data = validateRequest(insertProjectSchema, req, res);
    if (!data) return;
    
    try {
      const project = await storage.createProject(data);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to create project", error });
    }
  });

  // GET all saved candidates
  app.get("/api/saved-candidates", async (_req, res) => {
    try {
      const savedCandidates = await storage.getSavedCandidates();
      res.json(savedCandidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved candidates", error });
    }
  });

  // POST save a candidate
  app.post("/api/saved-candidates", async (req, res) => {
    const data = validateRequest(insertSavedCandidateSchema, req, res);
    if (!data) return;
    
    try {
      const savedCandidate = await storage.saveCandidate(data);
      res.status(201).json(savedCandidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to save candidate", error });
    }
  });

  // DELETE remove a saved candidate
  app.delete("/api/saved-candidates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid saved candidate ID" });
      }
      
      await storage.removeSavedCandidate(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove saved candidate", error });
    }
  });

  // GET all imports
  app.get("/api/imports", async (_req, res) => {
    try {
      const imports = await storage.getImports();
      res.json(imports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch imports", error });
    }
  });

  // POST create a new import
  app.post("/api/imports", async (req, res) => {
    const data = validateRequest(insertImportSchema, req, res);
    if (!data) return;
    
    try {
      const importData = await storage.createImport(data);
      res.status(201).json(importData);
    } catch (error) {
      res.status(500).json({ message: "Failed to create import", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
