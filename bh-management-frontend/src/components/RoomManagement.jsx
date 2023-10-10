import singleBed from "/room-management/single-bed.png"
import doubleBed from "/room-management/double-bed.png"
import RoomCard from "./RoomCard";
import RoomPopUp from "./RoomPopUp";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
const SimplePieChart = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    fill="#8884d8"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    legendType="diamond"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};
function RoomManagement() {
    // let [didMount, setDidMount] = useState(false);
    let [initialList, setInitialList] = useState([])
    let [roomList, setRoomList] = useState([]);
    // let [filteredList, setFilteredList] = useState([]);
    let [getList, setGetList] = useState(true);
    let [inputStates, setInputStates] = useState({
        occupied: false,
        vacant: false,
        single: false,
        double: false
    });
    let [filterStatus, setFilterStatus] = useState({
        room: false,
        price: false,
        type: false
    });
    let [selectedRoom, setSelectedRoom] = useState({});
    let [showPopUp, setShowPopUp] = useState(false);
    let [popUpType, setPopUpType] = useState("assign");
    let [roomStatusData, setRoomStatusData] = useState([]);
    function toggleGetList() {
        setGetList((getList) ? false : true);
    }
    const togglePopUp = () => {
        setShowPopUp((showPopUp) ? false : true);
    }
    const togglePopUpType = (id) => {
        if (id === "assign-button") {
            setPopUpType("assign")
        }
        else {
            setPopUpType("remove")
        }
    }
    const removeTenant = (cRoomNumber) => {
        setSelectedRoom({
            roomNumber: cRoomNumber
        });
    }
    const onAssign = (cRoomType, cRoomNumber, cRoomPrice) => {
        setSelectedRoom({
            roomType: cRoomType,
            roomNumber: cRoomNumber,
            roomPrice: cRoomPrice
        })
    }
    function filterList(data, filterType) {
        let x = [];
        if (filterType === 2700 || filterType === 3500) {
            x = data.filter((element) => {
                return element.room_fee === filterType
            });
        }
        else if (filterType === 0 || filterType === 1) {
            x = data.filter((element) => {
                return element.room_status === filterType
            });
        }
        return x
    }
    // initial render
    useEffect(() => {
        // get room status analytics
        fetch("http://localhost:3000/room/status-analytics", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setRoomStatusData(data);
        });
        fetch("http://localhost:3000/room", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setInitialList(data);
        });
    }, []);
    // get list of rooms
    useEffect(() => {
        console.log("bruh")
        fetch("http://localhost:3000/room", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setRoomList(data);
        });
        fetch("http://localhost:3000/room/status-analytics", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setRoomStatusData(data);
        });
    }, [getList]);

    return (
        <section className="room-management">
            <div className="room-filters">
                <h3>
                    Filter
                    <button onClick={() => {
                        setRoomList(initialList);
                        setInputStates({
                            occupied: false,
                            vacant: false,
                            single: false,
                            double: false
                        })
                    }}><span>clear</span></button>
                </h3>
                <h5>Room Status</h5>
                <div className="filter-option">
                    <input checked={inputStates.occupied} type="radio" name="status" id="occupied" value="1" onChange={(e) => {
                        if (filterStatus.room) {
                            let x = filterList(initialList, parseInt(e.target.value))
                            console.log(x)
                            setRoomList(x)
                        } else {
                            let x = filterList(roomList, parseInt(e.target.value))
                            setFilterStatus({
                                ...filterStatus,
                                room: true
                            })
                            setRoomList(x);
                        }
                        setInputStates({
                            ...inputStates,
                            occupied: (inputStates.occupied) ? false : true,
                            vacant: false
                        })
                    }} />
                    <label htmlFor="occupied">Occupied</label>
                </div>
                <div className="filter-option">
                    <input checked={inputStates.vacant} type="radio" name="status" id="vacant" value="0" onChange={(e) => {
                        if (filterStatus.room) {
                            let x = filterList(initialList, parseInt(e.target.value))
                            setRoomList(x)
                        } else {
                            let x = filterList(roomList, parseInt(e.target.value))
                            setFilterStatus({
                                ...filterStatus,
                                room: true
                            })
                            setRoomList(x);
                        }
                        setInputStates({
                            ...inputStates,
                            vacant: (inputStates.vacant) ? false : true,
                            occupied: false
                        })
                    }} />
                    <label htmlFor="vacant">Vacant</label>
                </div>
                <h5>Room Price</h5>
                <div className="filter-option">
                    <input checked={inputStates.single} type="radio" name="price" id="single-price" value="2700" onChange={(e) => {
                        if (filterStatus.price) {
                            let x = filterList(initialList, parseInt(e.target.value))
                            setRoomList(x)
                        } else {
                            let x = filterList(roomList, parseInt(e.target.value))
                            setFilterStatus({
                                ...filterStatus,
                                price: true
                            })
                            setRoomList(x);
                        }
                        setInputStates({
                            ...inputStates,
                            single: (inputStates.single) ? false : true,
                            double: false
                        })
                    }} />
                    <label htmlFor="single-price">2700.00 php</label>
                </div>
                <div className="filter-option">
                    <input checked={inputStates.double} type="radio" name="price" id="double-price" value="3500" onChange={(e) => {
                        if (filterStatus.price) {
                            let x = filterList(initialList, parseInt(e.target.value))
                            setRoomList(x)
                        } else {
                            let x = filterList(roomList, parseInt(e.target.value))
                            setFilterStatus({
                                ...filterStatus,
                                price: true
                            })
                            setRoomList(x);
                        }
                        setInputStates({
                            ...inputStates,
                            double: (inputStates.double) ? false : true,
                            single: false
                        })
                    }} />
                    <label htmlFor="double-price">3500.00 php</label>
                </div>
            </div>
            <div className="room-list">
                <RoomPopUp toggleGetList={toggleGetList} showPopUp={showPopUp} popUpType={popUpType} roomInfo={selectedRoom} isActive={showPopUp} togglePopUp={togglePopUp}></RoomPopUp>
                <h3>ROOM LIST</h3>
                <div className="card-container">
                    {
                        roomList.map((element) => {
                            return <RoomCard removeTenant={removeTenant} togglePopUp={togglePopUp} popUpType={togglePopUpType} onAssign={onAssign} key={element.room_number} roomImage={[singleBed, doubleBed]} roomName={element.room_type} roomNumber={element.room_number} roomType={element.room_type} roomStatus={element.room_status} roomFee={element.room_fee}></RoomCard>
                        })
                    }
                </div>
            </div>
            <div className="room-analytics">
                <h3>Room Overview</h3>
                <div className="room-status">
                    <SimplePieChart data={roomStatusData}></SimplePieChart>
                </div>
            </div>
        </section>
    )
}
export default RoomManagement;