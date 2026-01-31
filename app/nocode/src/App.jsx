import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

// ✅ 改成你原页面组件的真实路径：
// 例1：如果是 src/pages/LongSaverHome.jsx
// import LongSaverHome from "./pages/LongSaverHome"
// 例2：如果就是 src/LongSaverHome.jsx
import LongSaverHome from "./LongSaverHome"

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 吃掉 magic link 回来的 token / code
    const init = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")

      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
        window.history.replaceState({}, document.title, window.location.pathname)
      } else {
        await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (window.location.hash.includes("access_token")) {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }

      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)

      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ?? null)
      })

      return () => sub?.subscription?.unsubscribe()
    }

    init()
  }, [])

  const signIn = async () => {
    const email = prompt("输入邮箱（会发 magic link）")
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })

    alert(error ? error.message : "已发送登录邮件，去邮箱点链接完成登录。")
  }

  const insertOne = async () => {
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr) return alert(userErr.message)
    if (!userData?.user) return alert("你还没登录，请先点“邮箱登录”。")

    const u = userData.user
    const { error } = await supabase.from("expenses").insert({
      user_id: u.id,
      amount: 12.34,
      category: "food",
      note: "test from longsaver",
    })

    alert(error ? error.message : "插入成功 ✅")
  }

  return (
    <div>
      {/* ✅ 这块只是加的“Supabase 小工具栏”，不会覆盖你原页面 */}
      <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <span style={{ marginRight: 12 }}>
          {user ? `已登录：${user.email}` : "未登录"}
        </span>

        <button onClick={signIn}>邮箱登录</button>
        <button onClick={insertOne} style={{ marginLeft: 8 }}>
          插入一条记账
        </button>
      </div>

      {/* ✅ 这里是你原来的 LongSaver 页面 */}
      <LongSaverHome user={user} />
    </div>
  )
}
