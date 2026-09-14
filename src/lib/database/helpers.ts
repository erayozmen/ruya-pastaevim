import type { Database } from "./types";

/**
 * Convenience generics over the generated `Database` type, following the
 * pattern from the Supabase docs. Usage:
 *
 *   type Category = Tables<"categories">;
 *   type NewCategory = TablesInsert<"categories">;
 *   type CategoryUpdate = TablesUpdate<"categories">;
 *
 * No Supabase client is created here — that lands in Sprint 3 once the
 * public site is wired up to real data. This file only exists so the
 * generated schema types have a clean, app-facing entry point.
 */

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
