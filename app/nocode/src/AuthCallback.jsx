import { useEffect } from "react"
import { supabase } from "./supabaseClient"

export default function AuthCallback() {
  useEffect(() => {
    const run = async () => {
      const href = window.location.href

      // 1) PKCE: ?code=...
      if (href.includes("code=")) {
        const { error } = await supabase.auth.exchangeCodeForSession(href)
        if (error) {
          alert("登录失败: " + error.message)
          return
        }
      } else {
        // 2) Implicit: #access_token=...
        const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (error) {
          alert("登录失败: " + error.message)
          return
        }
      }

      window.location.replace("/")
    }

    run()
  }, [])

  return <div style={{ padding: 24 }}>登录中…</div>
}
