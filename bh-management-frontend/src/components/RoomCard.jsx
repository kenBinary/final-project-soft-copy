export default function RoomCard({ removeTenant, togglePopUp, popUpType, onAssign, roomImage, roomName, roomNumber, roomType, roomStatus, roomFee }) {
    let capacity = (roomType === "single room") ? "1" : "2";
    let status = (roomStatus) ? "Occupied" : "Vacant";
    let image = (roomType === "single room") ? roomImage[0] : roomImage[1];
    return (
        <div className="room-card">
            <img src={image} alt="room-image" />
            <div className="room-details">
                <h3 >{roomName}</h3>
                <div className="room-info">
                    <p>Room Number: {roomNumber}</p>
                    <p>Room Capacity: {capacity}</p>
                    <p>Room Status: {status}</p>
                    <p>Room Price: {roomFee} php</p>
                </div>
                <div className="room-actions">
                    <button id="assign-button" onClick={(e) => {
                        onAssign(roomType, roomNumber, roomFee);
                        popUpType(e.target.id);
                        togglePopUp();
                    }}><span>Assign a Tenant</span></button>
                    <button id="remove-button" onClick={(e) => {
                        removeTenant(roomNumber)
                        popUpType(e.target.id);
                        togglePopUp();
                    }}><span>Remove a Tenant</span></button>
                    {/* <button id="assign-button" onClick={(e) => {
                        onAssign(roomType, roomNumber, roomFee);
                        popUpType(e.target.id);
                        togglePopUp();
                    }}>Assign a Tenant</button>
                    <button id="remove-button" onClick={(e) => {
                        removeTenant(roomNumber)
                        popUpType(e.target.id);
                        togglePopUp();
                    }}>Remove a Tenant</button> */}
                </div>
            </div>
        </div >
    )
}