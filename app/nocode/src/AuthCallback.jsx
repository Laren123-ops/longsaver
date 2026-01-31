import { useEffect } from "react"
import { supabase } from "./supabaseClient"

export default function AuthCallback() {
  useEffect(() => {
    ;(async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (error) {
        alert(error.message)
      }
      // 不管成功失败，都回主页（成功的话 session 已经存了）
      window.location.replace("/")
    })()
  }, [])

  return <div style={{ padding: 24 }}>Logging you in...</div>
}
