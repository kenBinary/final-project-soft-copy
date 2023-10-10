import tenant from "/public/tenant-management/tenant.svg";
import TableData from "./TableData";
import TenantPopUp from "./TenantPopUp";
import { useEffect, useState } from "react";
function TableSelector({ togglePopUp, updatePopUpType, tableType, updateTableType }) {
    if (tableType === "necessity") {
        return (
            <div className="table-selector" id={tableType}>
                <select defaultValue="necessity" onChange={(e) => {
                    updateTableType(e.target.value);
                }}>
                    <option value="necessity">Necessities</option>
                    <option value="payment-history">Payment History</option>
                </select>

                <button onClick={() => {
                    updatePopUpType("add-necessity");
                    togglePopUp();
                }} type="button"><span>Add Necessity</span></button>
            </div>
        )
    }
    return (
        <div className="table-selector">
            <select value={tableType} onChange={(e) => {
                updateTableType(e.target.value);
            }}>
                <option value="necessity">Necessities</option>
                <option value="payment-history">Payment History</option>
            </select>
        </div>
    )
}
export default function TenantManagement() {
    let [didMount, setDidMount] = useState(false)
    let [tenantList, setTenantList] = useState([]);
    let [isLoading, setIsLoading] = useState(true);
    let [showPopUp, setShowPopUp] = useState(false);
    let [popUpType, setPopUpType] = useState("");
    let [selectedTenant, setSelectedTenant] = useState({
        tenantId: "",
        firstName: "",
        lastName: "",
        contact: "",
        archiveStatus: "",
        identification: "",
    });
    let [tenantInfo, setTenantInfo] = useState({
        first_name: "",
        last_name: "",
        contact_number: "",
        occupancy_status: "",
        identification_number: "",
        room_number: "",
        room_type: ""
    });
    let [tableType, setTableType] = useState("necessity");
    let [tableData, setTableData] = useState([]);
    function togglePopUp() {
        setShowPopUp((showPopUp) ? false : true);
    }
    function updateSelectedTenant(tenantObject) {
        setSelectedTenant(tenantObject);
    }
    function updateTableType(newType) {
        setTableType(newType);
    }
    function updatePopUpType(popUpType) {
        setPopUpType(popUpType);
    }
    // initial render
    useEffect(() => {
        // let id;
        let id = fetch("http://localhost:3000/tenant", {
            method: "GET"
        }).then(response => {
            return response.json()
        }).then((data) => {
            if (data.length > 0) {
                setSelectedTenant({
                    ...selectedTenant,
                    tenantId: data[0].tenant_id
                });
                setTenantList(data);
                id = data[0].tenant_id;
                setTenantInfo(data[0]);
                return data[0];
            }
            return false;
        });
        id.then((data) => {
            if (data) {
                fetch(`http://localhost:3000/necessity/${data.tenant_id}`, {
                    method: "GET"
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setTableData(data)
                });
            }
        });
        setIsLoading(false);
        setDidMount(true);
    }, []);
    // gets tenant information
    useEffect(() => {
        if (didMount) {
            fetch(`http://localhost:3000/tenant/${selectedTenant.tenantId}`, {
                method: "GET"
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setTenantInfo(data[0]);
            });
        }
    }, [selectedTenant]);
    // get tenant list
    useEffect(() => {
        if (didMount) {
            fetch("http://localhost:3000/tenant", {
                method: "GET"
            }).then(response => {
                return response.json()
            }).then((data) => {
                setTenantList(data);
            });
        }
    }, [showPopUp]);

    // get table data
    useEffect(() => {
        if (didMount) {
            if (tableType === "necessity") {
                fetch(`http://localhost:3000/necessity/${selectedTenant.tenantId}`, {
                    method: "GET"
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setTableData(data)
                });
            }
            else if (tableType === "payment-history") {
                // b57bd7ab-5dc9-11ee-9182-31dbb6fccc0c
                fetch(`http://localhost:3000/payment/history/${selectedTenant.tenantId}`, {
                    method: "GET"
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setTableData(data)
                });
            }
        }
        // if (tableType === "necessity") {
        //     fetch(`http://localhost:3000/necessity/${selectedTenant.tenantId}`, {
        //         method: "GET"
        //     }).then(response => {
        //         return response.json()
        //     }).then((data) => {
        //         setTableData(data)
        //     });
        // }
        // else if (tableType === "payment-history") {
        //     console.log("tanan")
        // }
    }, [tableType, selectedTenant, showPopUp]);

    if (isLoading) {
        return (<div>...loading</div>)
    }
    return (
        <section className="tenant-management">
            <TenantPopUp updateSelectedTenant={updateSelectedTenant} selectedTenant={selectedTenant} showPopUp={showPopUp} togglePopUp={togglePopUp} popUpType={popUpType}></TenantPopUp>
            <aside>
                <div className="tenant-list">
                    <h3>
                        Tenant List
                    </h3>
                    {
                        tenantList.map((element) => {
                            return <div onClick={(e) => {
                                setSelectedTenant({
                                    tenantId: element.tenant_id,
                                    firstName: element.first_name,
                                    lastName: element.last_name,
                                    contact: element.contact_number,
                                    archiveStatus: element.archive_status,
                                    identification: element.identification_number,
                                });
                            }} data-id={element.tenant_id} className="tenant-record" key={element.tenant_id}>
                                <div>{element.first_name + " " + element.last_name}</div>
                                <button id={element.tenant_id} onClick={(e) => {
                                    setSelectedTenant({
                                        tenantId: element.tenant_id,
                                        firstName: element.first_name,
                                        lastName: element.last_name,
                                        contact: element.contact_number,
                                        archiveStatus: element.archive_status,
                                        identification: element.identification_number,
                                    });
                                    e.stopPropagation();
                                    setPopUpType("edit");
                                    togglePopUp();
                                }}><span>Edit</span></button></div>
                        })
                    }
                </div>
                <button onClick={() => {
                    setPopUpType("add");
                    togglePopUp();
                }}><span>Add New Tenant</span></button>
            </aside>
            <section className="tenant-info">
                <img src={tenant} alt="tenant-image" />
                <div className="tenant-details">
                    <h3>Tenant Information</h3>
                    <div>Full Name: {tenantInfo.first_name + " " + tenantInfo.last_name}</div>
                    <div>ID Number: {tenantInfo.identification_number}</div>
                    <div>Phone Number: {tenantInfo.contact_number}</div>
                    <div>Assigned Room: {tenantInfo.room_number}</div>
                    <div>Room Type: {tenantInfo.room_type}</div>
                    <div>Occupancy Status:{(tenantInfo.occupancy_status) ? "Occupying" : ""}</div>
                </div>
            </section>
            <section className="tenant-extra-info">
                <TableSelector togglePopUp={togglePopUp} updatePopUpType={updatePopUpType} tableType={tableType} updateTableType={updateTableType}></TableSelector>
                <TableData tenantData={tableData}></TableData>
            </section>
        </section>
    )
}