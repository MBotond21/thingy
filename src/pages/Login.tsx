export default function Login() {
    return <>
        <div className="formPage">
            <form>
                <div className="formElement">
                    <input type="email" name="email" placeholder="Email" />
                </div>
                <div className="formElement">
                    <input type="password" name="psw" placeholder="Password" />
                </div>
            </form>
        </div>
    </>
}