import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "../components/Chatbot";

function MainLayout() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <>
            <Header />
            <main><Outlet /></main>
            <Chatbot user={user} />
            <Footer />
        </>
    )

}
export default MainLayout;