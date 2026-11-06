import { createClient } from "@supabase/supabase-js";

// "Ține-mă minte": cu bifa, sesiunea rămâne în localStorage; fără bifă, doar până închizi tab-ul (sessionStorage).
const remember = () => localStorage.getItem("urgentasp-remember") !== "0";
const storage = {
  getItem: (k) => localStorage.getItem(k) ?? sessionStorage.getItem(k),
  setItem: (k, v) => (remember() ? localStorage : sessionStorage).setItem(k, v),
  removeItem: (k) => { localStorage.removeItem(k); sessionStorage.removeItem(k); },
};

export const sb = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  { auth: { storage } }
);
