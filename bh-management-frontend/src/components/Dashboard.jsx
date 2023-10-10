import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Label } from 'recharts';
import collectionIcon from "/dashboard/collection.svg"
import revenueIcon from "/dashboard/revenue.svg"
import tenantIcon from "/dashboard/tenant.svg"
import vacantIcon from "/dashboard/vacant.svg"



const SimpleLineChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'dataMax+500']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};
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
                    outerRadius={150}
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
        </ResponsiveContainer >
    );
};

export default function Dashboard() {
    let [didMount, setDidMount] = useState(false);
    let [monthlyRevenue, setMonthlyRevenue] = useState(0);
    let [yearlyRevenue, setYearlyRevenue] = useState(0);
    let [totalTenants, setTotalTenants] = useState([]);
    let [vacantRooms, setVacantRooms] = useState(0)
    let [rentCollection, setRentCollection] = useState(0)
    let [roomStatusData, setRoomStatusData] = useState([]);
    // const lineChartData = [
    //     { name: 'Jan', value: 25 },
    //     { name: 'Feb', value: 30 },
    //     { name: 'Mar', value: 45 },
    //     { name: 'Apr', value: 28 },
    //     { name: 'May', value: 35 },
    //     { name: 'May', value: 35 },
    //     { name: 'May', value: 35 },
    //     { name: 'May', value: 35 },
    //     { name: 'May', value: 35 },
    //     { name: 'May', value: 35 },
    //     { name: 'May', value: 35 },
    //     { name: 'May', value: 35 },
    // ];
    // initial render
    useEffect(() => {
        // get monthly revenue
        fetch("http://localhost:3000/dashboard/monthly-revenue", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setMonthlyRevenue(data);
        });
        fetch("http://localhost:3000/dashboard/yearly-revenue", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setYearlyRevenue(data);
        });
        fetch("http://localhost:3000/dashboard/total-tenants", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setTotalTenants(data);
        });
        fetch("http://localhost:3000/dashboard/vacant-rooms", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setVacantRooms(data);
        });
        fetch("http://localhost:3000/dashboard/rent-collection", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data)
            setRentCollection(data);
        });
        fetch("http://localhost:3000/room/status-analytics", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setRoomStatusData(data);
        });
        setDidMount(true);
    }, [])
    if (!didMount) {
        return <div>Loading...</div>
    }
    return (
        <section className="dashboard">
            <div>
                <h2>Dashboard</h2>
            </div>
            <div className="stat-summary">
                <div>
                    <div>
                        Monthly Revenue
                    </div>
                    <div>
                        ₱ {monthlyRevenue.revenue}
                    </div>
                    <div>
                        <img className="icon" src={revenueIcon} alt="" />
                    </div>
                </div>
                <div>
                    <div>
                        Total Tenants
                    </div>
                    <div>
                        {totalTenants.total_tenants}
                    </div>
                    <div>
                        <img className="icon" src={tenantIcon} alt="" />
                    </div>
                </div>
                <div>
                    <div>
                        Rent Collections
                    </div>
                    <div>
                        {rentCollection.total}
                    </div>
                    <div>
                        <img className="icon" src={collectionIcon} alt="" />
                    </div>
                </div>
                <div>
                    <div>
                        Vacant Rooms
                    </div>
                    <div>
                        {vacantRooms.total_vacant}
                    </div>
                    <div>
                        <img className="icon" src={vacantIcon} alt="" />
                    </div>
                </div>
            </div>
            <div className="tenant-room-analytics">
                <div className="line-chart">
                    <h3>Payment Overview</h3>
                    <SimpleLineChart data={yearlyRevenue}></SimpleLineChart>
                </div>
                <div className="occupancy-chart">
                    <h3>Room Overview</h3>
                    <SimplePieChart data={roomStatusData}></SimplePieChart>
                </div>
            </div>
        </section>
    )
}