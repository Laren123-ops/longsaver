import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function AuthCallback() {
  const [msg, setMsg] = useState("登录处理中…")

  useEffect(() => {
    const run = async () => {
      // ✅ PKCE：用 URL 里的 ?code=... 换 session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (error) {
        setMsg("登录失败：" + error.message)
        return
      }

      setMsg("登录成功，正在跳回首页…")
      window.location.replace("/") // 回到首页 App.jsx -> 读取到 user -> 进入 LongSaverHome
    }

    run()
  }, [])

  return <div style={{ padding: 24 }}>{msg}</div>
}
