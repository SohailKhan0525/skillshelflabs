"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "../../components/site-nav";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

export default function ProfilePage() {
  const router = useRouter();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  useEffect(()=>{ (async()=>{ const s=getSupabaseBrowser(); const {data:{user}}=await s.auth.getUser(); if(!user){router.replace("/submit");return;} setEmail(user.email??""); setName(user.user_metadata?.display_name??""); })(); },[router]);
  return <main><SiteNav/><section className="page-head shell"><p className="eyebrow">PROFILE</p><h1>{name || "Creator profile"}</h1><p>{email}</p></section></main>;
}