function TableRow({ updateSelectedData, togglePopUp, dataID, tableData, tableHeadings, showDetail }) {

    return (
        <tr>
            {tableHeadings.map((element, index) => {
                const regex = /\d{4}-\d{2}-\d{2}/g;
                if (typeof (tableData[element]) === "string") {
                    const found = tableData[element].match(regex);
                    let isFound = (found) ? true : false;
                    if (isFound) {
                        return <td key={tableData[dataID]}>{found[0]}</td>
                    }
                }
                return <td key={index}>{tableData[element]}</td>
            })}
            {
                showDetail &&
                <td>
                    <button onClick={() => {
                        updateSelectedData(tableData[dataID]);
                        togglePopUp();
                    }}><span>details</span></button>
                </td>
            }
            {/* <td>
                <button onClick={() => {
                    updateSelectedData(tableData[dataID]);
                    togglePopUp();
                }}>details</button>
            </td> */}
        </tr>
    )
}
export default function TableData({ updateSelectedData, togglePopUp, tenantData, showDetail }) {
    let tableHeadings = [];
    let tableId = [];
    if (tenantData.length > 0) {
        let dataKeys = Object.keys(tenantData[0]);
        tableHeadings = dataKeys.filter((element) => {
            const regex = new RegExp('.*_id');
            if (!(regex.test(element))) {
                return true;
            }
        })
        tableId = dataKeys.filter((element) => {
            const y = new RegExp('.*_id');
            const x = new RegExp('^(?!.*tenant).*_id$');
            if ((y.test(element))) {
                if ((x.test(element))) {
                    return true;
                }
            }
        })
    }
    else {
        return (
            <table>
                <thead>
                    <tr>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        )
    }
    return (
        <table>
            <thead>
                <tr>
                    {
                        tableHeadings.map((element, index) => {
                            return <th key={index}>{element}</th>
                        })
                    }
                    {
                        showDetail &&
                        <th>Actions</th>
                    }
                </tr>
            </thead>
            <tbody>
                {tenantData.map((element, index) => {
                    return <TableRow showDetail={showDetail} key={index} updateSelectedData={updateSelectedData} togglePopUp={togglePopUp} dataID={tableId[0]} tableHeadings={tableHeadings} tableData={element}></TableRow>
                })}
            </tbody>
        </table>
    )
}