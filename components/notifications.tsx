"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "../lib/supabase-browser";

type Notification = {
  id: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
};

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowser();

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !mounted) return;

      const { data } = await supabase
        .from("notifications")
        .select("id,title,message,read_at,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(12);

      if (mounted) setItems((data ?? []) as Notification[]);

      channel = supabase
        .channel("creator-notifications")
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        }, payload => {
          if (mounted) setItems(current => [payload.new as Notification, ...current].slice(0, 12));
        })
        .subscribe();
    }

    void load();

    return () => {
      mounted = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const unread = items.filter(item => !item.read_at).length;

  async function markRead(id: string) {
    const supabase = getSupabaseBrowser();
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    setItems(current => current.map(item => item.id === id ? { ...item, read_at: new Date().toISOString() } : item));
  }


  return (
    <div className="notification-wrap">
      <button className="notification-button" type="button" aria-label={unread ? `${unread} unread notifications` : "Notifications"} onClick={() => setOpen(value => !value)}>
        <span aria-hidden="true">●</span>{unread > 0 && <b>{unread > 9 ? "9+" : unread}</b>}
      </button>
      {open && (
        <div className="notification-panel" role="dialog" aria-label="Notifications">
          <div className="notification-head"><strong>Notifications</strong><span>{unread ? `${unread} unread` : "All caught up"}</span></div>
          {items.map(item => (
            <button key={item.id} className={`notification-item ${item.read_at ? "" : "unread"}`} type="button" onClick={() => void markRead(item.id)}>
              <strong>{item.title}</strong>
              <span>{item.message}</span>
              <small>{new Date(item.created_at).toLocaleString()}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
