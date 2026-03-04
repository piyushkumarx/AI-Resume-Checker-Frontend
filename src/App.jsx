import { useState, useEffect } from "react";
import LoginCard from "./components/LoginCard";
import RegisterCard from "./components/RegisterCard";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import { auth } from "./firebase";
import InvalidModal from "./components/Invalid";
import AccountCreated from "./components/AccountCreated";
import Already from "./components/Already";

function App() {
  const [page, setPage] = useState("login");
  const [modalData, setModalData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [already, setAlready] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setPage("dashboard");
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("token");
    setPage("login");
  };

  return (
    <>
      {page === "login" && (
        <LoginCard setPage={setPage} setModalData={setModalData} />
      )}

      {page === "register" && (
        <RegisterCard
          setPage={setPage}
          setShowSuccess={setShowSuccess}
          alreadyfnc={setAlready}
        />
      )}

      {page === "forgot" && <ForgotPassword setPage={setPage} />}

      {page === "dashboard" && (
        <Dashboard
          setPage={setPage}
          setModalData={setModalData}
          handleLogout={handleLogout}
        />
      )}

      {modalData && (
        <InvalidModal
          title={modalData.title}
          disc={modalData.message}
          onClose={() => setModalData(null)}
        />
      )}

      {already && <Already setPage={setPage} setAlready={setAlready}/>}

      <AccountCreated
        isOpen={showSuccess}
        onConfirm={() => {
          setShowSuccess(false);
          setPage("login");
        }}
      />
    </>
  );
}

export default App;
