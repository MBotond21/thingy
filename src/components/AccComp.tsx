import { useNavigate } from "react-router";

export default function AccComp(){
    const navigate = useNavigate();

    return<>
        <div className="acc">
            <button className="btn hidden md:block" onClick={() => navigate("/signup")}>Signup</button>
            <button className="btn hidden md:block" onClick={() => navigate("/login")}>Login</button>
            <button className="btn md:hidden" onClick={() => navigate("/login")}>Menu</button>
        </div>
    </>
}