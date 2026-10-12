"use server";

import { redirect } from "next/navigation";
import { requireResident } from "@/lib/auth/dal";
import { createMaintenanceRequest } from "@/lib/resident/service";
import { MAINTENANCE_CATEGORIES, type MaintenanceCategory } from "@/lib/resident/types";

export interface MaintenanceFormValues {
  category: string;
  title: string;
  description: string;
  permissionToEnter: boolean;
}

export type MaintenanceFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<keyof MaintenanceFormValues, string>>; values: MaintenanceFormValues }
  | { status: "error"; message: string; values: MaintenanceFormValues };

export async function submitMaintenanceRequest(
  _prev: MaintenanceFormState,
  formData: FormData,
): Promise<MaintenanceFormState> {
  // Identity always comes from the verified session, never from the form.
  const resident = await requireResident("/dashboard/maintenance/new");

  const values: MaintenanceFormValues = {
    category: String(formData.get("category") ?? ""),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    permissionToEnter: formData.get("permissionToEnter") === "on",
  };

  const errors: Partial<Record<keyof MaintenanceFormValues, string>> = {};
  if (!MAINTENANCE_CATEGORIES.some((c) => c.value === values.category)) errors.category = "Please choose a category.";
  if (values.title.length < 3) errors.title = "Please add a short summary (at least 3 characters).";
  else if (values.title.length > 120) errors.title = "Please keep the summary under 120 characters.";
  if (values.description.length < 10) errors.description = "Please describe the issue (at least 10 characters).";
  else if (values.description.length > 2000) errors.description = "Please keep the description under 2,000 characters.";
  if (Object.keys(errors).length > 0) return { status: "invalid", errors, values };

  const result = await createMaintenanceRequest(resident, {
    category: values.category as MaintenanceCategory,
    title: values.title,
    description: values.description,
    permissionToEnter: values.permissionToEnter,
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        result.reason === "unsupported"
          ? "Online maintenance requests aren't available yet. Please use the resident portal."
          : "We couldn't submit your request just now. Please try again in a few minutes.",
      values,
    };
  }

  redirect(`/dashboard/maintenance/${encodeURIComponent(result.data.id)}?submitted=1`);
}
