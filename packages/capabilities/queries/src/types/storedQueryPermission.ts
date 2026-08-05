import type { User } from "@ecosystem/foundation";
import type { UserRole } from "@ecosystem/foundation";

export interface SavedQueryPermission {

    id: number;

    /**
     * XOR relationship:
     * one of these should normally exist
     */
    user: User | null;

    role: UserRole | null;

    level: string;
}