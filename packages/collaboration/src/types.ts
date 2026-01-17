/**
 * Collaboration type definitions
 */

export interface User {
  id: string;
  name: string;
  avatar?: string;
  online: boolean;
  role?: "owner" | "editor" | "viewer";
  cursor?: { x: number; y: number };
}

export interface CollaborationMessage {
  type: string;
  payload: unknown;
  userId: string;
  timestamp: number;
}

export interface Operation {
  type: string;
  path: string;
  value?: unknown;
  oldValue?: unknown;
}
