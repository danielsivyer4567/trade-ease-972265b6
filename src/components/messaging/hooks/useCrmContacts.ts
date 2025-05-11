import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCrmContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      const { data, error } = await supabase.from("crm_contacts").select("*");
      if (!error) setContacts(data);
      setLoading(false);
    }
    fetchContacts();
  }, []);

  // Update contact status
  async function updateContactStatus(id: string, status: string) {
    await supabase.from("crm_contacts").update({ status, last_updated: new Date().toISOString() }).eq("id", id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status, last_updated: new Date().toISOString() } : c));
  }

  return { contacts, setContacts, loading, updateContactStatus };
} 