import { useEffect } from "react"
import { supabase } from "./supabaseClient"

export default function AuthCallback() {
  useEffect(() => {
    const run = async () => {
      // ✅ PKCE：把 ?code=... 交换成 session，并存到 localStorage
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (error) {
        alert(error.message)
      }
      // ✅ 回主页（你的 LongSaver 主页在 /）
      window.location.replace("/")
    }
    run()
  }, [])

  return <div style={{ padding: 24 }}>登录中…</div>
}
