import { useNavigate } from "react-router"

export default function Login() {
    const navigate = useNavigate();

    return <>
        <main className="w-full h-full flex justify-center items-center">
            <div className="bg-222 w-4/5 h-4/5 md:w-2/5 lg:w-1/4 rounded-lg">
                <div className="w-full h-1/3 flex items-center justify-center">
                    <img src="/vite.svg" alt="site" onClick={() => navigate("/")} className="w-1/3 h-1/3 hover:cursor-pointer hue-rotate-90 rotate-6" />
                </div>
                <form className="w-full h-full">
                    <div className="formElement">
                        <input type="email" name="email" placeholder="Email" className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4" required />
                    </div>
                    <div className="formElement">
                        <input type="password" name="psw" placeholder="Password" className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4" required />
                    </div>
                    <button className="btn w-1/4 min-w-fit ml-f-1/4" >Login</button>
                    <p className="mt-1 text-mute w-full text-center">Don't have an account yet? <a onClick={() => navigate("/signup")} className="text-blue-500 hover:cursor-pointer ">Sign up</a></p>
                </form>
            </div>
        </main>
    </>
}