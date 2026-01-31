
import { supabase } from './supabaseClient'

export default function App(import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    ;(async () => {
      // 1) 如果是 magic link 回跳（#access_token=...），把它换成 session 并存起来
      const hasAccessToken = window.location.hash.includes("access_token=")
      const hasCode = window.location.search.includes("code=") // 兼容某些配置会返回 ?code=

      if (hasAccessToken) {
        const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (error) console.error("getSessionFromUrl error:", error)
        // 清理 URL（不然你每次刷新都会重复解析）
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
      } else if (hasCode) {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) console.error("exchangeCodeForSession error:", error)
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      // 2) 读出当前 session
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    })()

    // 3) 监听登录状态变化
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // 下面你想怎么渲染都行：未登录显示登录按钮；已登录显示你的 LongSaver 页面
  // 你现在先保留“测试页按钮”也可以
  ...
}
) {
  const signIn = async () => {
    const email = prompt('输入邮箱（会发 magic link）')
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: window.location.origin, // ← 回到根域名，最稳
  },
})


    alert(error ? error.message : '已发送登录邮件，去邮箱点链接登录')
  }

  const insertOne = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) return alert(userError.message)
    if (!user) return alert('你还没登录，先点“邮箱登录”')

    const { error } = await supabase.from('expenses').insert({
      user_id: user.id,
      amount: 12.34,
      category: 'food',
      note: 'test from longsaver',
      spent_at: new Date().toISOString(),
    })

    alert(error ? error.message : '插入成功！去 Supabase Table Editor 看 expenses 表')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>LongSaver Supabase Test</h1>
      <button onClick={signIn}>1) 邮箱登录</button>
      <button onClick={insertOne} style={{ marginLeft: 12 }}>
        2) 插入一条记账
      </button>
    </div>
  )
}
