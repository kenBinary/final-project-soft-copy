import { useState } from "react";

export default function TenantPopUp({ updateSelectedTenant, selectedTenant, showPopUp, togglePopUp, popUpType }) {
    let [addTenantInfo, setAddTenantInfo] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        identification: ''
    });
    let [necessity, setNecessity] = useState({
        type: "",
        fee: ""
    });
    function addTenant(firstName, lastName, contactNumber, identificationNumber) {
        fetch("http://localhost:3000/tenant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: String(firstName),
                lastName: String(lastName),
                contactNum: String(contactNumber),
                identificationNumber: String(identificationNumber)
            })
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            togglePopUp();
        });
    }
    function editTenant(tenantId, pFirstName, pLastName, pContact, pArchiveStatus, pIdentification) {
        const url = `http://localhost:3000/tenant/${tenantId}`;
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newFirstName: pFirstName,
                newLastName: pLastName,
                newContactNum: pContact,
                newStatus: pArchiveStatus,
                newIdentification: pIdentification
            })
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            togglePopUp();
        });
    }
    function addNecessity(tenantId, fee, type) {
        fetch("http://localhost:3000/necessity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newId: String(tenantId),
                newFee: String(fee),
                newType: String(type),
            })
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            togglePopUp();
        });
    }

    if (popUpType === "edit") {
        return (
            <div className={"pop-up-container" + ((showPopUp) ? " " : " hide")}>
                <div className="pop-up">
                    <div>
                        <h3>Edit Tenant</h3>
                        <div>X</div>
                    </div>
                    <input type="text" value={selectedTenant.firstName} onChange={(e) => {
                        updateSelectedTenant({
                            ...selectedTenant,
                            firstName: e.target.value
                        })
                    }} name="first-name" id="first-name" />
                    <input type="text" onChange={(e) => {
                        updateSelectedTenant({
                            ...selectedTenant,
                            lastName: e.target.value
                        })
                    }} value={selectedTenant.lastName} name="last-name" id="last-name" />
                    <input type="number" onChange={(e) => {
                        updateSelectedTenant({
                            ...selectedTenant,
                            contact: e.target.value
                        })
                    }} value={selectedTenant.contact} name="contact-number" id="contact-number" />
                    <input type="text" onChange={(e) => {
                        updateSelectedTenant({
                            ...selectedTenant,
                            identification: e.target.value
                        })
                    }} value={selectedTenant.identification} name="identification" id="identification" />
                    <div>
                        <input value={selectedTenant.archiveStatus} type="checkbox" id="archive" onChange={(e) => {
                            if (e.target.value === "0") {
                                updateSelectedTenant({
                                    ...selectedTenant,
                                    archiveStatus: "1"
                                })
                            }
                            else {
                                updateSelectedTenant({
                                    ...selectedTenant,
                                    archiveStatus: "0"
                                })
                            }
                        }} />
                        <label htmlFor="archive">Archive Tenant</label>
                    </div>
                    <div>
                        <button type="button" onClick={() => {
                            editTenant(selectedTenant.tenantId, selectedTenant.firstName, selectedTenant.lastName, selectedTenant.contact, selectedTenant.archiveStatus, selectedTenant.identification);
                        }}>
                            Edit
                        </button>
                        <button type="button" onClick={() => {
                            togglePopUp();
                        }}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    if (popUpType === "add-necessity") {
        return (<div className={"pop-up-container" + ((showPopUp) ? " " : " hide")}>
            <div className="pop-up add-necessity">
                <div>
                    <h3>Add Necessity</h3>
                    <div>X</div>
                </div>
                <input value={necessity.type} type="text" onChange={(e) => {
                    setNecessity({
                        ...necessity,
                        type: e.target.value
                    })
                }} placeholder="Enter Necessity Type" required />
                <input value={necessity.fee} type="number" onChange={(e) => {
                    setNecessity({
                        ...necessity,
                        fee: e.target.value
                    });
                }} placeholder="Enter Necessity Fee" required />
                <div className="room-action">
                    <button onClick={() => {
                        addNecessity(selectedTenant.tenantId, necessity.fee, necessity.type);
                        setNecessity({
                            type: "",
                            fee: ""
                        });
                    }}>
                        Add
                    </button>
                    <button onClick={() => {
                        togglePopUp();
                    }}>
                        Back
                    </button>
                </div>
            </div>
        </div>
        )
    }
    return (
        <div className={"pop-up-container" + ((showPopUp) ? " " : " hide")}>
            <div className="pop-up">
                <div>
                    <h3>Add Tenant</h3>
                    <div>X</div>
                </div>
                <input type="text" value={addTenantInfo.firstName} onChange={(e) => {
                    setAddTenantInfo({
                        ...addTenantInfo,
                        firstName: e.target.value
                    });
                }} placeholder="First Name" id="first-name" />
                <input value={addTenantInfo.lastName} onChange={(e) => {
                    setAddTenantInfo({
                        ...addTenantInfo,
                        lastName: e.target.value
                    });
                }} type="text" placeholder="Last Name" name="last-name" id="last-name" />
                <input value={addTenantInfo.contact} onChange={(e) => {
                    setAddTenantInfo({
                        ...addTenantInfo,
                        contact: e.target.value
                    });
                }} type="number" placeholder="Contact Number" name="contact-number" id="contact-number" />
                <input value={addTenantInfo.identification} onChange={(e) => {
                    setAddTenantInfo({
                        ...addTenantInfo,
                        identification: e.target.value
                    });
                }} type="text" placeholder="Identification" name="identification" id="identification" />
                <div className="room-action">
                    <button type="button" onClick={() => {
                        addTenant(addTenantInfo.firstName, addTenantInfo.lastName, addTenantInfo.contact, addTenantInfo.identification);
                        setAddTenantInfo({
                            firstName: '',
                            lastName: '',
                            contact: '',
                            identification: ''
                        });
                    }}>
                        Add
                    </button>
                    <button type="button" onClick={() => {
                        togglePopUp();
                    }}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}