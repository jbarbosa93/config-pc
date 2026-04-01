"use client";

import { useState, useEffect, useCallback } from "react";
import type { DBComponent, ComponentType } from "@/lib/db-types";

const TYPES: ComponentType[] = ["CPU", "GPU", "RAM", "Stockage", "Carte mère", "Alimentation", "Boîtier", "Refroidissement"];

const SITES = ["galaxus", "digitec", "brack", "interdiscount", "steg", "conrad", "mediamarkt", "ldlc-ch", "amazon-de"];

interface ComponentWithRelations extends DBComponent {
  component_images?: { id: string; url: string; is_primary: boolean; alt_text: string }[];
  component_prices?: { id: string; site: string; price: number; currency: string; url: string; in_stock: boolean }[];
}

function api(path: string, token: string, opts?: RequestInit) {
  return fetch(`/api/admin/${path}`, {
    ...opts,
    headers: { authorization: `Bearer ${token}`, ...opts?.headers },
  });
}

export default function AdminPanel() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [components, setComponents] = useState<ComponentWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ComponentWithRelations | null>(null);
  const [filter, setFilter] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api("components", token);
    if (res.ok) {
      setComponents(await res.json());
      setAuthed(true);
    } else {
      setAuthed(false);
    }
    setLoading(false);
  }, [token]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    load();
  }

  const filtered = filter ? components.filter((c) => c.type === filter) : components;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <h1 className="text-xl font-bold mb-6">Admin ConfigPC.ch</h1>
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-black"
          />
          <button type="submit" className="w-full py-3 bg-black text-white rounded-xl font-medium">
            {loading ? "Chargement..." : "Connexion"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">Admin ConfigPC.ch</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{components.length} composants</span>
            <button onClick={() => setEditing({} as ComponentWithRelations)} className="px-4 py-2 bg-black text-white text-sm rounded-lg font-medium">
              + Ajouter
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${!filter ? "bg-black text-white" : "bg-white border border-gray-200"}`}>
            Tous
          </button>
          {TYPES.map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === t ? "bg-black text-white" : "bg-white border border-gray-200"}`}>
              {t} ({components.filter((c) => c.type === t).length})
            </button>
          ))}
        </div>

        {/* Components list */}
        <div className="grid gap-3">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                {c.component_images?.find((i) => i.is_primary)?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.component_images.find((i) => i.is_primary)!.url} alt={c.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl text-gray-300">?</span>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 font-medium">{c.type}</span>
                  <span className="text-[10px] text-gray-400">{c.brand}</span>
                  {!c.active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600">Inactif</span>}
                </div>
                <p className="font-medium text-sm mt-0.5 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.price_ch} CHF · {c.price_fr}€ · {c.component_images?.length || 0} images · {c.component_prices?.length || 0} prix</p>
              </div>
              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(c)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Modifier</button>
                <button
                  onClick={async () => {
                    if (!confirm(`Supprimer ${c.name} ?`)) return;
                    await api(`components?id=${c.id}`, token, { method: "DELETE" });
                    load();
                  }}
                  className="px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-12">Aucun composant{filter ? ` de type ${filter}` : ""}. Clique sur &quot;+ Ajouter&quot; pour commencer.</p>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editing && (
        <ComponentForm
          component={editing}
          token={token}
          onClose={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

/* ── Component Form Modal ── */

function ComponentForm({ component, token, onClose }: {
  component: ComponentWithRelations;
  token: string;
  onClose: () => void;
}) {
  const isNew = !component.id;
  const [form, setForm] = useState({
    type: component.type || "CPU",
    name: component.name || "",
    brand: component.brand || "",
    price_ch: component.price_ch || 0,
    price_fr: component.price_fr || 0,
    socket: component.socket || "",
    chipset: component.chipset || "",
    form_factor: component.form_factor || "",
    tdp: component.tdp || 0,
    description: component.description || "",
    manufacturer_url: component.manufacturer_url || "",
    popularity_score: component.popularity_score || 50,
    release_year: component.release_year || 2025,
    available_ch: component.available_ch ?? true,
    active: component.active ?? true,
    specs: JSON.stringify(component.specs || {}, null, 2),
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [priceSite, setPriceSite] = useState(SITES[0]);
  const [priceVal, setPriceVal] = useState(0);
  const [priceUrl, setPriceUrl] = useState("");

  function upd(field: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    let specs = {};
    try { specs = JSON.parse(form.specs); } catch { /* keep empty */ }

    const payload = { ...form, specs, id: component.id };
    const method = isNew ? "POST" : "PUT";
    const res = await api("components", token, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) onClose();
    else alert("Erreur: " + (await res.json()).error);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length || !component.id) return;
    setUploadingImage(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("component_id", component.id);
      fd.append("is_primary", (component.component_images?.length === 0).toString());
      await api("images", token, { method: "POST", body: fd });
    }
    setUploadingImage(false);
    onClose();
  }

  async function handleAddPrice() {
    if (!component.id || !priceVal) return;
    await api("prices", token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ component_id: component.id, site: priceSite, price: priceVal, url: priceUrl }),
    });
    onClose();
  }

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">{isNew ? "Nouveau composant" : `Modifier: ${component.name}`}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">&times;</button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => upd("type", e.target.value)} className={inputClass}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Marque</label>
              <input value={form.brand} onChange={(e) => upd("brand", e.target.value)} className={inputClass} placeholder="AMD, Intel, Nvidia..." />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nom complet</label>
            <input value={form.name} onChange={(e) => upd("name", e.target.value)} className={inputClass} placeholder="AMD Ryzen 5 7600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Prix CH (CHF)</label>
              <input type="number" value={form.price_ch} onChange={(e) => upd("price_ch", Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Prix FR (EUR)</label>
              <input type="number" value={form.price_fr} onChange={(e) => upd("price_fr", Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Socket</label>
              <input value={form.socket} onChange={(e) => upd("socket", e.target.value)} className={inputClass} placeholder="AM5, LGA1700..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Chipset</label>
              <input value={form.chipset} onChange={(e) => upd("chipset", e.target.value)} className={inputClass} placeholder="B650, Z790..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">TDP (W)</label>
              <input type="number" value={form.tdp} onChange={(e) => upd("tdp", Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Format</label>
              <input value={form.form_factor} onChange={(e) => upd("form_factor", e.target.value)} className={inputClass} placeholder="ATX, mATX..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Popularité (0-100)</label>
              <input type="number" value={form.popularity_score} onChange={(e) => upd("popularity_score", Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Année</label>
              <input type="number" value={form.release_year} onChange={(e) => upd("release_year", Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => upd("description", e.target.value)} rows={3} className={inputClass} placeholder="Description complète du composant..." />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">URL fabricant</label>
            <input value={form.manufacturer_url} onChange={(e) => upd("manufacturer_url", e.target.value)} className={inputClass} placeholder="https://www.amd.com/..." />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Specs (JSON)</label>
            <textarea value={form.specs} onChange={(e) => upd("specs", e.target.value)} rows={4} className={`${inputClass} font-mono text-xs`} placeholder='{"Cores": "6/12", "Socket": "AM5"}' />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => upd("active", e.target.checked)} /> Actif
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.available_ch} onChange={(e) => upd("available_ch", e.target.checked)} /> Disponible CH
            </label>
          </div>

          {/* Images section (only for existing components) */}
          {!isNew && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-medium mb-3">Images</h3>
              <div className="flex gap-2 flex-wrap mb-3">
                {component.component_images?.map((img) => (
                  <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt_text} className="w-full h-full object-contain" />
                    {img.is_primary && <span className="absolute top-0.5 left-0.5 text-[8px] bg-black text-white px-1 rounded">Primary</span>}
                  </div>
                ))}
              </div>
              <label className="inline-block px-4 py-2 text-xs border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                {uploadingImage ? "Upload..." : "Ajouter des images"}
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}

          {/* Prices section (only for existing components) */}
          {!isNew && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-medium mb-3">Prix par site</h3>
              {component.component_prices?.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-xs mb-1.5">
                  <span className="font-medium w-24">{p.site}</span>
                  <span>{p.price} {p.currency}</span>
                  <span className={p.in_stock ? "text-green-600" : "text-red-500"}>{p.in_stock ? "En stock" : "Indispo"}</span>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 truncate max-w-[150px]">{p.url}</a>}
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <select value={priceSite} onChange={(e) => setPriceSite(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs">
                  {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="number" placeholder="Prix" value={priceVal || ""} onChange={(e) => setPriceVal(Number(e.target.value))} className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-xs" />
                <input placeholder="URL fiche produit" value={priceUrl} onChange={(e) => setPriceUrl(e.target.value)} className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs" />
                <button onClick={handleAddPrice} className="px-3 py-1.5 bg-black text-white text-xs rounded-lg">Ajouter</button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg">Annuler</button>
          <button onClick={handleSave} disabled={saving || !form.name} className="px-6 py-2 bg-black text-white text-sm rounded-lg font-medium disabled:opacity-40">
            {saving ? "Enregistrement..." : isNew ? "Créer" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
