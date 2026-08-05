export interface UserRole {
    id: number;

    code: string;
    name: string;
    description: string;

    is_active: boolean;
    deactivated_at: string | null;

    created_at: string;
    updated_at: string;
}