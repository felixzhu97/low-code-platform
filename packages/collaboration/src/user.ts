/**
 * User state management utilities
 */

export interface UserState {
  id: string;
  name: string;
  online: boolean;
  role?: "owner" | "editor" | "viewer";
  lastActive?: number;
}

/**
 * User state manager
 */
export class UserStateManager {
  private users = new Map<string, UserState>();

  updateUser(user: UserState): void {
    this.users.set(user.id, user);
  }

  getUser(id: string): UserState | undefined {
    return this.users.get(id);
  }

  getAllUsers(): UserState[] {
    return Array.from(this.users.values());
  }

  removeUser(id: string): void {
    this.users.delete(id);
  }

  clear(): void {
    this.users.clear();
  }
}
