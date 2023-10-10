import { useState, useEffect } from "react"
export default function Login({ updateAuth }) {
    let [userDetails, setUserDetails] = useState({
        username: "",
        password: ""
    });
    let [didMount, setDidMount] = useState(false);
    function logIn(username, password) {
        fetch(`http://localhost:3000/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then((data) => {
            return data.json()
        }).then((data) => {
            updateAuth(data.auth);
            // console.log(data)
        }).catch((error) => {
            console.log(error)
        });
    }
    // useEffect(() => {
    //     if (didMount) {

    //         fetch("http://localhost:3000/roomfee/unpaid", {
    //             method: "GET"
    //         }).then(response => {
    //             return response.json();;
    //         }).then((data) => {
    //             setPopUpType("room-table")
    //             setTableData(data);
    //         });


    //     }
    //     setDidMount(true);
    // });
    return (
        <main className="login-container">
            <div>
                <h2>JoshSiah's Boarding House</h2>
                <h4>Username</h4>
                <input onChange={(e) => {
                    setUserDetails({
                        ...userDetails,
                        username: e.target.value
                    });
                }} type="text" value={userDetails.username} />
                <h4>Password</h4>
                <input onChange={(e) => {
                    setUserDetails({
                        ...userDetails,
                        password: e.target.value
                    });
                }} type="password" value={userDetails.password} />
                <button onClick={() => {
                    logIn(userDetails.username, userDetails.password)
                }}>LOGIN</button>
            </div>
        </main>
    )

}