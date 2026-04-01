import type { RegisteredComponent } from "@builder.io/sdk-react";
import { register } from "@builder.io/sdk-react";

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Extends Builder's `RegisteredComponent` with an `excludeModels` denylist.
 * Use this instead of `RegisteredComponent` when your component config needs
 * to declare which models it should be hidden from.
 *
 * ```ts
 * export const textConfig: ComponentConfig = {
 *   component: Text,
 *   name: config.components.text,
 *   excludeModels: [config.models.announcementBar],
 *   inputs: [ ... ],
 * };
 * ```
 */
export type ComponentConfig = RegisteredComponent & {
  /**
   * Optional model denylist. When provided, the component is hidden from the
   * insert menu when editing any of these models. Use this to keep
   * model-specific editors free of irrelevant components.
   */
  excludeModels?: string[];
};

/**
 * Minimal shape the insert menu needs from each item. Both `RegisteredComponent`
 * and `ComponentConfig` satisfy this interface, so you can pass full component
 * configs directly as section items.
 */
interface InsertMenuItem {
  name: string;
  models?: string[];
  excludeModels?: string[];
}

interface InsertMenuSection {
  name: string;
  priority?: number;
  /**
   * Optional model allowlist. When provided, the section is only registered
   * when editing one of these models. Use this to build dedicated insert
   * menus for specific models.
   */
  allowedModels?: string[];
  /**
   * Optional model denylist. When provided, the section is hidden when
   * editing any of these models. Use this to hide general-purpose sections
   * from models that have their own dedicated insert menu.
   */
  excludeModels?: string[];
  items: InsertMenuItem[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the Builder model name from the current URL's `?model=` search
 * param. In the Builder visual editor the preview iframe always includes this
 * param (see `app/preview/page.tsx` for the URL patterns).
 *
 * Returns `null` on the server or when the param is absent (e.g. production
 * pages that aren't inside the editor).
 */
function getCurrentModel(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("model");
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Registers one or more insert-menu sections, filtering out items whose
 * model scope doesn't match the model currently being edited. Sections that
 * end up empty after filtering are skipped entirely so the editor never shows
 * hollow category headers.
 *
 * Items are typically full component configs (`ComponentConfig` or
 * `RegisteredComponent`) — the utility reads `name`, `models`, and
 * `excludeModels` from each item and ignores the rest.
 *
 * **Item-level `models`** — include the item only when editing one of these
 * models (mirrors `RegisteredComponent.models`).
 *
 * **Item-level `excludeModels`** — hide the item when editing one of these
 * models (from `ComponentConfig.excludeModels`).
 *
 * **Section-level `allowedModels`** — register the entire section only when
 * editing one of these models.
 *
 * **Section-level `excludeModels`** — hide the entire section when editing
 * one of these models.
 *
 * ```ts
 * registerInsertMenu([
 *   {
 *     name: "General",
 *     priority: 1,
 *     items: [buttonConfig, textConfig, badgeConfig],
 *   },
 *   {
 *     name: "Announcement Bar",
 *     allowedModels: [config.models.announcementBar],
 *     items: [announcementBarConfig],
 *   },
 * ]);
 * ```
 */
export function registerInsertMenu(sections: InsertMenuSection[]): void {
  const currentModel = getCurrentModel();

  for (const section of sections) {
    // Section-level allowlist: only show for these models.
    if (section.allowedModels && section.allowedModels.length > 0) {
      if (!currentModel || !section.allowedModels.includes(currentModel))
        continue;
    }

    // Section-level denylist: hide from these models.
    if (section.excludeModels && section.excludeModels.length > 0) {
      if (currentModel && section.excludeModels.includes(currentModel))
        continue;
    }

    // Item-level gate: filter out items whose model scope doesn't match.
    const visibleItems = section.items.filter((item) => {
      // Item-level denylist: hide from these models.
      if (item.excludeModels && item.excludeModels.length > 0) {
        if (currentModel && item.excludeModels.includes(currentModel))
          return false;
      }
      // Item-level allowlist: show only for these models.
      if (!item.models || item.models.length === 0) return true;
      if (!currentModel) return true;
      return item.models.includes(currentModel);
    });

    if (visibleItems.length === 0) continue;

    register("insertMenu", {
      name: section.name,
      ...(section.priority != null && { priority: section.priority }),
      items: visibleItems.map(({ name }) => ({ name })),
    });
  }
}

/**
 * Filters an array of component configs for a given model, removing components
 * whose `excludeModels` includes the model or whose `models` allowlist doesn't.
 * Use this to pass only relevant components to Builder's `<Content>` so
 * excluded components don't appear under the default "Custom Components" bucket.
 */
export function filterComponentsForModel(
  components: ComponentConfig[],
  model: string,
): ComponentConfig[] {
  return components.filter((comp) => {
    if (comp.excludeModels && comp.excludeModels.includes(model)) return false;
    if (comp.models && comp.models.length > 0 && !comp.models.includes(model))
      return false;
    return true;
  });
}
