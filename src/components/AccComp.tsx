import { useNavigate } from "react-router";

export default function AccComp(){
    const navigate = useNavigate();

    return<>
        <div className="acc">
            <button className="btn" onClick={() => navigate("/signup")}>Signup</button>
            <button className="btn" onClick={() => navigate("/login")}>Login</button>
        </div>
    </>
}