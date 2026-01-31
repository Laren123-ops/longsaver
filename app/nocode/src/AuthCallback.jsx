import { useEffect } from "react"
import { supabase } from "./supabaseClient"

export default function AuthCallback() {
  useEffect(() => {
    const run = async () => {
      // 兼容两种情况：
      // 1) 新版 PKCE：url 里是 ?code=...
      // 2) 旧版 implicit：url 里是 #access_token=...
      const url = window.location.href

      // 如果是 code 模式，换 session
      if (url.includes("code=")) {
        const { error } = await supabase.auth.exchangeCodeForSession(url)
        if (error) {
          alert("Login failed: " + error.message)
          return
        }
      } else {
        // implicit 模式通常 createClient 会自动 detectSessionInUrl
        // 这里主动拿一下 session 做兜底
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          alert("Auth session missing!")
          return
        }
      }

      // 成功后跳回你的 longsaver 主页面（你想要去哪就改这里）
      window.location.replace("/")
    }

    run()
  }, [])

  return <div style={{ padding: 24 }}>Signing you in...</div>
}
