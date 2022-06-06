import './App.css';
import 'antd/dist/antd.css';
import TopNavBar from "./components/shared/TopNavBar/TopNavBar";
import LoginPage from "./pages/Login/Login";

function App() {
  return (
    <div>
      <TopNavBar />
        <LoginPage/>
    </div>
  );
}

export default App;
