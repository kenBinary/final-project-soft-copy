export default function PaymentPopUp({ popUpType, selectedData, showPopUp, togglePopUp, selectedDataDetails }) {
    function payFee(popUpType, feeId) {
        if (popUpType === "room-table") {
            fetch(`http://localhost:3000/roomfee/${feeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                togglePopUp();
            });
        }
        else if (popUpType === "utility-table") {
            fetch(`http://localhost:3000/utilityfee/${feeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                togglePopUp();
            });
        }
        else if (popUpType === "necessity-table") {
            fetch(`http://localhost:3000/necessityfee/${feeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                togglePopUp();
            });
        }
    }
    let keys = Object.keys(selectedDataDetails);
    return (
        <div className={"pop-up" + ((showPopUp) ? " " : " hide")}>
            <div>
                <h3>DETAILS</h3>
                {
                    keys.map((element) => {
                        const regex = /\d{4}-\d{2}-\d{2}/g;
                        if (typeof (selectedDataDetails[element]) === "string") {
                            const found = selectedDataDetails[element].match(regex);
                            let isFound = (found) ? true : false;
                            if (isFound) {
                                return (
                                    <>
                                        <div className="detail-title">{element}</div>
                                        <input type="text" value={found[0]} readOnly></input>
                                    </>
                                )
                            }
                        }
                        return (
                            <>
                                <div className="detail-title">{element}</div>
                                <input type="text" value={selectedDataDetails[element]} readOnly></input>
                            </>
                        )
                    })
                }
                <div className="pop-up-actions">
                    <button onClick={() => {
                        payFee(popUpType, selectedData);
                    }} type="button">Pay</button>
                    <button onClick={() => {
                        togglePopUp();
                    }} type="button">Back</button>
                </div>
            </div>
        </div>
    )
}