export default function LongSaverHome({ user, onSignOut }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>LongSaver</h1>
      <p>当前状态：{user ? `已登录：${user.email}` : "未登录"}</p>
      <button onClick={onSignOut}>退出登录</button>
    </div>
  );
}
