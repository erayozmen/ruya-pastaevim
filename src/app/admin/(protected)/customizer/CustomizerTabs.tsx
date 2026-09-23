"use client";

import { useState } from "react";
import {
  createColor,
  createFlavor,
  createPortion,
  createTheme,
  deleteColor,
  deleteFlavor,
  deletePortion,
  deleteTheme,
  updateColor,
  updateFlavor,
  updatePortion,
  updateTheme,
} from "./actions";
import { OptionForm, type OptionRow } from "./OptionForm";

const TABS = [
  { key: "portions", label: "Porsiyonlar" },
  { key: "themes", label: "Temalar" },
  { key: "colors", label: "Renkler" },
  { key: "flavors", label: "Lezzetler" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function CustomizerTabs({
  portions,
  themes,
  colors,
  flavors,
}: {
  portions: OptionRow[];
  themes: OptionRow[];
  colors: OptionRow[];
  flavors: OptionRow[];
}) {
  const [active, setActive] = useState<TabKey>("portions");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 border-b border-neutral-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              active === tab.key
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "portions" && (
        <Section
          items={portions}
          extra="emoji"
          createAction={createPortion}
          updateAction={updatePortion}
          deleteAction={deletePortion}
          emptyLabel="Henüz porsiyon seçeneği yok."
        />
      )}
      {active === "themes" && (
        <Section
          items={themes}
          extra="emoji-image"
          createAction={createTheme}
          updateAction={updateTheme}
          deleteAction={deleteTheme}
          emptyLabel="Henüz tema seçeneği yok."
        />
      )}
      {active === "colors" && (
        <Section
          items={colors}
          extra="swatch"
          createAction={createColor}
          updateAction={updateColor}
          deleteAction={deleteColor}
          emptyLabel="Henüz renk seçeneği yok."
        />
      )}
      {active === "flavors" && (
        <Section
          items={flavors}
          extra="none"
          createAction={createFlavor}
          updateAction={updateFlavor}
          deleteAction={deleteFlavor}
          emptyLabel="Henüz lezzet seçeneği yok."
        />
      )}
    </div>
  );
}

function Section({
  items,
  extra,
  createAction,
  updateAction,
  deleteAction,
  emptyLabel,
}: {
  items: OptionRow[];
  extra: "none" | "emoji" | "emoji-image" | "swatch";
  createAction: (state: { error?: string; success?: boolean } | undefined, formData: FormData) => Promise<{ error?: string; success?: boolean } | undefined>;
  updateAction: (id: string, state: { error?: string; success?: boolean } | undefined, formData: FormData) => Promise<{ error?: string; success?: boolean } | undefined>;
  deleteAction: (id: string) => Promise<{ error?: string }>;
  emptyLabel: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Yeni Ekle</p>
        <OptionForm key={items.length} extra={extra} action={createAction} />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Mevcut Seçenekler</p>
        {items.length === 0 && <p className="text-sm text-neutral-500">{emptyLabel}</p>}
        {items.map((item) => (
          <OptionForm
            key={item.id}
            row={item}
            extra={extra}
            action={updateAction.bind(null, item.id)}
            onDelete={deleteAction}
          />
        ))}
      </div>
    </div>
  );
}
