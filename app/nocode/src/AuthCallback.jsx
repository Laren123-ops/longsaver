import { useEffect } from "react"
import { supabase } from "./supabaseClient"

export default function AuthCallback() {
  useEffect(() => {
    const run = async () => {
      const url = window.location.href
      const hasCode = new URL(url).searchParams.get("code")

      let error = null

      if (hasCode) {
        // ✅ PKCE 回调：用 code 换 session
        const res = await supabase.auth.exchangeCodeForSession(url)
        error = res.error
      } else {
        // ✅ 旧版隐式流：吃 hash 里的 access_token
        const res = await supabase.auth.getSessionFromUrl({ storeSession: true })
        error = res.error
      }

      if (error) {
        alert(error.message)
      }

      // ✅ 清理 URL，回到主页
      window.history.replaceState({}, document.title, "/")
      window.location.replace("/")
    }

    run()
  }, [])

  return <div style={{ padding: 24 }}>Logging in...</div>
}
