import type { UserRole } from "./userRole";

export interface User {
    id: number;

    username: string;
    full_name: string;
    email: string;

    role: UserRole | null;

    is_active: boolean;
    deactivated_at: string | null;

    is_staff: boolean;

    date_joined: string;

    created_at: string;
    updated_at: string;
}