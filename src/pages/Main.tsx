import { Outlet } from "react-router-dom";

const Main = () => {
    return (
    <div className={styles.search_section}>
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Enter GitHub username"
    />
    <button onClick={() => handleSearch(username)}>搜索</button>
  </div>
    <Outlet />;
    )
}
export default Main;