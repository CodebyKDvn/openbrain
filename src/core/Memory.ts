import { nanoid } from 'nanoid';

export enum MemoryType {
  EPISODIC = 'episodic',
  SEMANTIC = 'semantic',
  PROCEDURAL = 'procedural',
  DECISION = 'decision',
  BUG = 'bug',
  WORKSPACE = 'workspace',
  PROJECT = 'project',
  REFLECTION = 'reflection',
  SKILL = 'skill'
}

export interface MemoryBase {
  id: string;
  type: MemoryType;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  tags: string[];
  confidence: number;
  metadata: Record<string, any>;
}

export interface EpisodicMemory extends MemoryBase {
  type: MemoryType.EPISODIC;
  metadata: {
    sessionId?: string;
    timestamp: Date;
    events: string[];
    participants?: string[];
    location?: string;
  };
}

export interface SemanticMemory extends MemoryBase {
  type: MemoryType.SEMANTIC;
  metadata: {
    concept?: string;
    category?: string;
    source?: string;
    provenance?: string;
  };
}

export interface ProceduralMemory extends MemoryBase {
  type: MemoryType.PROCEDURAL;
  metadata: {
    skillId?: string;
    steps: string[];
    prerequisites?: string[];
  };
}

export interface DecisionMemory extends MemoryBase {
  type: MemoryType.DECISION;
  metadata: {
    context: string;
    options: string[];
    outcome: string;
    reasoning: string;
  };
}

export interface BugMemory extends MemoryBase {
  type: MemoryType.BUG;
  metadata: {
    issueDescription: string;
    reproductionSteps?: string[];
    rootCause?: string;
    fix?: string;
    filePaths?: string[];
  };
}

export interface WorkspaceMemory extends MemoryBase {
  type: MemoryType.WORKSPACE;
  metadata: {
    projectId: string;
    filePaths: string[];
    currentTask?: string;
    recentChanges?: string[];
  };
}

export interface ProjectMemory extends MemoryBase {
  type: MemoryType.PROJECT;
  metadata: {
    projectId: string;
    techStack: string[];
    architecture: string;
    goals?: string[];
    decisions: string[];
  };
}

export type Memory = 
  | EpisodicMemory
  | SemanticMemory
  | ProceduralMemory
  | DecisionMemory
  | BugMemory
  | WorkspaceMemory
  | ProjectMemory;

export function createMemory<T extends MemoryBase>(
  type: MemoryType,
  content: string,
  metadata: T['metadata'],
  tags: string[] = [],
  confidence: number = 0.8
): T {
  const now = new Date();
  return {
    id: nanoid(),
    type,
    createdAt: now,
    updatedAt: now,
    content,
    tags,
    confidence,
    metadata
  } as T;
}
