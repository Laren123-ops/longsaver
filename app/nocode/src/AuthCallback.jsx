import { useEffect } from "react"
import { supabase } from "./supabaseClient"

export default function AuthCallback() {
  useEffect(() => {
    ;(async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (error) {
        alert(error.message)
        return
      }
      // ✅ 登录成功后跳回首页（你真正的 LongSaver 页面）
      window.location.replace("/")
    })()
  }, [])

  return <div style={{ padding: 24 }}>Signing in...</div>
}
