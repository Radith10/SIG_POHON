// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// GANTI DENGAN URL DAN KEY DARI DASHBOARD SUPABASE KAMU
// (Cek di Menu: Project Settings -> API)
const supabaseUrl = "https://vhatzvuqfnbifcmrzfqm.supabase.co";
const supabaseKey = "sb_publishable_lKyk9mmBiHSBglPbzZKN1A_QcZY1NPD";

export const supabase = createClient(supabaseUrl, supabaseKey);
