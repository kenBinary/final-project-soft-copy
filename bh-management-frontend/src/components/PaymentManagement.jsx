import { useState, useEffect } from "react";
import TableData from "./TableData";
import PaymentPopUp from "./PaymentPopUp";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';


function SimplePieChart({ data }) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
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
const SimpleBarChart = ({ data, didMount }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={400} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'dataMax+500']} />
                <Tooltip />
                <Legend />
                <Bar barSize={70} dataKey="revenue" fill="#FFBB28" />
            </BarChart>
        </ResponsiveContainer>
    );
};
export default function PaymentManagement() {
    let [didMount, setDidMount] = useState(false);
    let [currentTable, setCurrentTable] = useState("room-table");
    let [tableData, setTableData] = useState([]);
    let [showPopUp, setShowPopUp] = useState(false);
    let [selectedDataDetails, setSelectedDataDetails] = useState([]);
    let [selectedData, setSelectedData] = useState("");
    let [popUpType, setPopUpType] = useState("");
    let [recentPayments, setRecentPayments] = useState([]);
    let [paidAnalyticsData, setPaidAnalyticsData] = useState([]);
    let [paymentAnalyticsData, setPaymentAnalyticsData] = useState([]);
    function togglePopUp() {
        setShowPopUp((showPopUp) ? false : true);
    }
    function updateSelectedData(data) {
        setSelectedData(data);
    }
    // initialize table data
    useEffect(() => {
        fetch("http://localhost:3000/roomfee/unpaid", {
            method: "GET"
        }).then(response => {
            return response.json();;
        }).then((data) => {
            setPopUpType("room-table")
            setTableData(data);
        });
        fetch("http://localhost:3000/payment/recent", {
            method: "GET"
        }).then(response => {
            return response.json();;
        }).then((data) => {
            setRecentPayments(data);
        });
        fetch("http://localhost:3000/payment/analytics/paid-unpaid", {
            method: "GET"
        }).then(response => {
            return response.json();;
        }).then((data) => {
            setPaidAnalyticsData(data);
        });
        fetch("http://localhost:3000/payment/analytics/payment-analytics", {
            method: "GET"
        }).then(response => {
            return response.json();;
        }).then((data) => {
            setPaymentAnalyticsData(data);
        });
        setDidMount(true);
    }, []);
    // gets all fees
    useEffect(() => {
        if (didMount) {
            // room fees
            if (currentTable === "room-table") {
                fetch("http://localhost:3000/roomfee/unpaid", {
                    method: "GET"
                }).then(response => {
                    return response.json();;
                }).then((data) => {
                    setPopUpType("room-table")
                    setTableData(data);
                    // setIsLoading(false)
                });
            }
            else if (currentTable === "utility-table") {
                // utility fees
                fetch("http://localhost:3000/utilityfee/unpaid", {
                    method: "GET"
                }).then(response => {
                    return response.json();;
                }).then((data) => {
                    setPopUpType("utility-table")
                    setTableData(data);
                    // setIsLoading(false)
                });
            }
            else if (currentTable === "necessity-table") {
                // necessity fees
                fetch("http://localhost:3000/necessityfee/unpaid", {
                    method: "GET"
                }).then(response => {
                    return response.json();;
                }).then((data) => {
                    setPopUpType("necessity-table")
                    setTableData(data);
                    // setIsLoading(false)
                });
            }
        }
    }, [currentTable, showPopUp]);

    // gets specific fee record
    useEffect(() => {
        if (didMount) {
            if (popUpType === "room-table") {
                fetch(`http://localhost:3000/roomfee/${selectedData}`, {
                    method: "GET"
                }).then(response => {
                    return response.json();;
                }).then((data) => {
                    setSelectedDataDetails(data[0])
                    // setIsLoading(false)
                });
            }
            else if (popUpType === "utility-table") {
                fetch(`http://localhost:3000/utilityfee/${selectedData}`, {
                    method: "GET"
                }).then(response => {
                    return response.json();;
                }).then((data) => {
                    setSelectedDataDetails(data[0])
                    // setIsLoading(false)
                });
            }
            else if (popUpType === "necessity-table") {
                fetch(`http://localhost:3000/necessityfee/${selectedData}`, {
                    method: "GET"
                }).then(response => {
                    return response.json();;
                }).then((data) => {
                    setSelectedDataDetails(data[0])
                    // setIsLoading(false)
                });
            }
        }
    }, [selectedData]);

    return (
        <section className="payment-management">
            <PaymentPopUp popUpType={popUpType} selectedData={selectedData} selectedDataDetails={selectedDataDetails} showPopUp={showPopUp} togglePopUp={togglePopUp}></PaymentPopUp>
            <div className="upcoming-dues">
                <select className="table-selector" onChange={(e) => {
                    setCurrentTable(e.target.value);
                }} defaultValue="room-table" id="payment-type">
                    <option value="room-table">Room</option>
                    <option value="utility-table">Utility</option>
                    <option value="necessity-table">Necessity</option>
                </select>
                <h3>Unpaid Payments</h3>
                <TableData showDetail={true} updateSelectedData={updateSelectedData} togglePopUp={togglePopUp} tenantData={tableData}></TableData>
            </div>
            <div className="recent-payments">
                <h3>Recent Payments</h3>
                <TableData showDetail={false} updateSelectedData={updateSelectedData} togglePopUp={togglePopUp} tenantData={recentPayments}></TableData>
            </div>
            <div className="analytics-container">
                <div className="paid-analytics">
                    <h3>Payment Status</h3>
                    <SimplePieChart data={paidAnalyticsData}></SimplePieChart>
                </div>
                <div className="payment-analytics" >
                    <h3>Payment Categories</h3>
                    <SimpleBarChart didMount={didMount} data={paymentAnalyticsData}></SimpleBarChart>
                </div>
            </div>
        </section>
    );
}