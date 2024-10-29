var grid = new ej.grids.Grid({
    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    allowPaging: true,
    actionBegin: actionBegin,
    actionComplete: actionComplete,
    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true, type: 'number' },
        { field: 'CustomerID', width: 140, headerText: 'Customer ID', type: 'string' },
        { field: 'ShipCity', headerText: 'ShipCity', width: 140 },
        { field: 'ShipCountry', headerText: 'ShipCountry', width: 140 }
    ]
});
grid.appendTo('#Grid');

var button = new ej.buttons.Button({
    content: 'Bind data via AJAX',
    cssClass: 'e-success'
});
button.appendTo('#buttons');
let flag = false;

document.getElementById('buttons').onclick = function () {
    const ajaxRequest = new ej.base.Ajax("https://localhost:7146/Grid/Getdata", 'POST');//Use remote server host number instead 7146
    ajaxRequest.send();
    ajaxRequest.onSuccess = (data) => {
        grid.dataSource = JSON.parse(data);
    };
};

function actionComplete(e) {
    if (e.requestType === 'save' || e.requestType === 'delete') {
        flag = false;
    }
}
function actionBegin(e) {

    if (!flag) {
        if (e.requestType == 'save' && (e.action == 'add')) {
            var editedData = e.data;
            e.cancel = true;
            var ajaxRequest = new ej.base.Ajax({
                url: 'https://localhost:7146/Grid/Insert',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            ajaxRequest.onSuccess = () => {
                flag = true;
                grid.endEdit();
            };
            ajaxRequest.onFailure = () => {
                flag = false;
            };
            ajaxRequest.send();
        }
        if (e.requestType == 'save' && (e.action == "edit")) {
            var editedData = e.data;
            e.cancel = true;
            var ajaxRequest = new ej.base.Ajax({
                url: 'https://localhost:7146/Grid/Update',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ value: editedData })
            });
            ajaxRequest.onSuccess = () => {
                flag = true;
                grid.endEdit();
            };
            ajaxRequest.onFailure = () => {
                flag = false;
            };
            ajaxRequest.send();
        }
        if (e.requestType == 'delete') {
            var editedData = e.data;
            e.cancel = true;
            var ajaxRequest = new ej.base.Ajax({
                url: 'https://localhost:7146/Grid/Delete',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ key: editedData[0][grid.getPrimaryKeyFieldNames()[0]] })
            });
            ajaxRequest.onSuccess = () => {
                flag = true;
                grid.deleteRecord();
            };
            ajaxRequest.onFailure = () => {
                flag = false;
            };
            ajaxRequest.send();
        }
    }
}
