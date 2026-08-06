import type { User } from "@ecosystem/foundation"; // Question this path
import type { SavedQueryPermission } from "./storedQueryPermission";

export interface SavedQuery {

    id: number;

    name: string;

    description: string;

    /**
     * ContentTypeField representation.
     *
     * Assuming your ContentTypeField returns:
     * "app_label.model"
     */
    model: string;

    /**
     * JSONField from Django.
     */
    query: Record<string, unknown>;

    /**
     * Null for system queries.
     */
    owner: User | null;

    is_system: boolean;

    permissions: SavedQueryPermission[];

    created_at: string;

    updated_at: string;
}