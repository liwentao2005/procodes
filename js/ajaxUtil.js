define([
    'jscore/core',
    './LoadTestRegionView',
    'tablelib/Table',
    'widgets/SelectBox',
    'widgets/Dialog',
    'widgets/InfoPopup',
    '../../widgets/tableCell/CellDetails/CellDetails',
    '../../widgets/tableCell/CellDelete/CellDelete',
    '../../widgets/tableCell/CellArrow/CellArrow',
    '../../widgets/tableCell/CellInput/CellInput',
    './widgets/APNSelectBox/APNSelectBox',
    '../../widgets/tableCell/CellTitle/CellTitle',
    './widgets/dialogTable/dialogTable',
    'aatlibrary/Ajax',
    'aatlibrary/Sharedata'
], function(core, View, Table, SelectBox, Dialog, InfoPopup, CellDetails, CellDelete, CellArrow, CellInput, APNSelectBox, CellTitle, dialogTable, aatlib, Sharedata) {

    return core.Region.extend({
        View: View,
        selectBox: {},
        eventID: {},
        tableOptions: {
            Rate: {
                'defaultValue': '100',
                'inputAttr': {
                    'type': 'number',
                    'min': '1',
                    'max': '1000'
                },
                'style': {
                    'width': '100px',
                }
            },
            Throughput: {
                'defaultValue': '100',
                'inputAttr': {
                    'type': 'number',
                    'min': '1',
                    'max': '1000000'
                },
                'style': {
                    'width': '100px',
                }
            },
            Duration: {
                'defaultValue': '30',
                'inputAttr': {
                    'type': 'number',
                    'min': '30',
                    'max': '300'
                },
                'style': {
                    'width': '100px',
                }
            },
            APN: {
                'style': {
                    'width': '75px'
                }
            }
        },
        onViewReady: function() {

            this.quota = 0;
            this.renderDialogs();
            this.renderSelectBox('ue-group', this.view.getUEGroupSelectBox());
            this.renderSelectBox('sgsn-mme', this.view.getMMESelectBox());
            this.createSelectedProcedureTable();
            this.createAllProcedureTable();
            this.eventID.input = this.view.getCasesNameInput().addEventHandler('input', function() {
                this.getEventBus().publish('updateButtons');
            }.bind(this));

            var socketCallback = this.socketUpdate = function(data) {
                if (Sharedata.isMsg4CurrentAdapter(data))
                    this.update(data);
            }.bind(this);

            Sharedata.getEnvirSocket().on('update', socketCallback);

            new InfoPopup({
                content: 'Use at most 50 characters including alphanumeric or underscores.'
            }).attachTo(this.view.getTestCaseNameHelpPlaceholder());

            new InfoPopup({
                content: '<b>Rate: </b>The number of procedures performed per second(times/sec.). Value range: 1-1000.<br />' +
                    '<b>Throughput: </b>The throughput of payload for one UE (kbps). Value range: 1-1000000.<br />' +
                    '<b>Duration: </b>The duration time for payload (sec.).Value range: 30-300. <br />' +
                    '<b>APN: </b>APN for PDN connectivity and payload procedures'
            }).attachTo(this.view.getSelectedProcedureListHelp());

            aatlib.ajax({
                url: '/api/quota',
                type: "GET",
                dataType: "json",
                success: function(response) {
                    this.view.getTestCaseRegionTitlePlaceholder().setText(response.result.quota_info);
                    this.quota = response.result.quota;
                }.bind(this),
                error: function(msg, xhr) {
                    errMsg = '(Get license info failed)';
                    this.view.getTestCaseRegionTitlePlaceholder().setText(errMsg);
                }.bind(this)
            });
        },

        free: function() {

            if (this.eventID.input) {
                this.view.getCasesNameInput().removeEventHandler(this.eventID.input);
                this.eventID.input = null;
            }
            this.view.getSelectedProcedureListHelp().children().forEach(function(child) {
                child.remove();
            });
            this.view.getTestCaseNameHelpPlaceholder().children().forEach(function(child) {
                child.remove();
            });

            Sharedata.getEnvirSocket().removeListener('update', this.socketUpdate);
            this.socketUpdate = null;

            if (this.eProcedureTabCell) {
                this.procedureTable.removeEventHandler('cellClicked', this.eProcedureTabCell);
                this.eProcedureTabCell = null;
            }
            if (this.casesTable) {
                this.casesTable.destroy();
                this.casesTable = null;
            }
            if (this.openDialog) {
                this.openDialog.destroy();
                this.openDialog = null;
            }
            if (this.deleteDialog) {
                this.deleteDialog.destroy();
                this.deleteDialog = null;
            }
            if (this.quotaDialog) {
                this.quotaDialog.destroy();
                this.deleteDialog = null;
            }
            if (this.selectedProcedureTable) {
                this.selectedProcedureTable.destroy();
                this.selectedProcedureTable = null;
            }
            if (this.procedureTable) {
                this.procedureTable.destroy();
                this.procedureTable = null;
            }
            for (var key in this.selectBox) {
                if (this.selectBox[key]) {
                    this.selectBox[key].destroy();
                    this.selectBox[key] = null;
                }
            }
            this.view.getTestCaseNameHelpPlaceholder().children().forEach(function(child) {
                child.remove();
            });
            this.view.getSelectedProcedureListHelp().children().forEach(function(child) {
                child.remove();
            });
        },

        onStart: function() {

            this.unsubscribeEvents();
            this.subscribeEvents();
        },

        onStop: function() {

            this.unsubscribeEvents();
        },

        update: function(data) {
            var obj = JSON.parse(data);
            if (obj.resource === 'sgsn-mme' || obj.resource === 'ue-group') {
                this.setSelectBox(obj.resource);
                if (this.selectBox[obj.resource].getValue().value !== undefined) {
                    this.setSelectBoxVal(obj.resource, this.selectBox[obj.resource].getValue().value);
                }
            }
        },

        renderDialogs: function() {

            this.casesTable = new dialogTable();
            this.openDialog = new Dialog({
                header: 'Open a test case',
                content: this.casesTable,
                buttons: [{
                    caption: 'Open',
                    color: 'darkBlue',
                    action: function() {
                        this.selectedProcedureTable.destroy();
                        this.createSelectedProcedureTable();
                        this.renderTestCase(this.casesTable.getSelectedRows());
                        this.openDialog.hide();
                    }.bind(this)
                }, {
                    caption: 'Cancel',
                    action: function() {
                        this.openDialog.hide();
                    }.bind(this)
                }]
            });

            this.deleteDialog = new Dialog({
                header: 'Delete',
                content: 'Are you sure you want to delete this test case?',
                optionalContent: "",
                type: 'warning',
                buttons: [{
                    caption: 'Delete',
                    color: 'darkBlue',
                    action: function() {
                        aatlib.ajax({
                            url: '/api/test_case/' + this.testCaseID,
                            type: "DELETE",
                            dataType: "json",
                            success: function(data) {
                                this.getEventBus().publish('notify', "Test Case " + this.getNameInput() + " Deleted", 'green');
                            }.bind(this)
                        });
                        this.deleteDialog.hide();
                        this.resetRegion();
                    }.bind(this)
                }, {
                    caption: 'Cancel',
                    action: function() {
                        this.deleteDialog.hide();
                    }.bind(this)
                }]
            });

            this.quotaDialog = new Dialog({
                header: "Test Case Save failed",
                content: "Couldn't create new test case due to license limit",
                type: 'error',
                buttons: [{
                    caption: 'Ok',
                    color: 'darkBlue',
                    action: function() {
                        this.quotaDialog.hide();
                    }.bind(this)
                }]
            });
        },

        deleteTestcase: function() {
            aatlib.ajax({
                url: '/api/test_collection',
                dataType: 'json',
                data: {
                    'case_id': this.getSavedId()
                },
                success: function(data) {
                    var test_collection_names = data.result;
                    var details;
                    var collectionStr = '';
                    if (test_collection_names.length === 0) {
                        this.deleteDialog.setOptionalContent('');
                        this.deleteDialog.show();
                    } else {
                        var collection_names = [];
                        test_collection_names.forEach(function(name) {
                            collection_names.push('"' + name + '"');
                        });
                        if (test_collection_names.length <= 5) {
                            collectionStr = collection_names.join(', ');
                            collectionStr += '.';
                        } else {
                            collectionStr = collection_names.slice(0, 5).join(', ');
                            collectionStr += '...';
                        }
                        details = 'If YES, this test case will also be removed from the following ' + test_collection_names.length + ' test ' +
                            (test_collection_names.length === 1 ? 'collection: ' : 'collections: ') + collectionStr;
                        this.deleteDialog.setOptionalContent(details);
                        this.deleteDialog.show();
                    }
                }.bind(this)
            });

        },

        subscribeEvents: function() {
            this.newEventID = this.getEventBus().subscribe('new', function() {
                if (!this.isAttached()) {
                    return;
                }

                var _ignored = !(this.selectedProcedureTable.getRows().length > 0 ||
                        this.getNameInput() !== '' ||
                        this.view.getDescriptionInput().getValue().trim() !== '') ||
                    this.getEventBus().publish('newConfirm');
            }.bind(this));

            this.newConfirmEventID =
                this.getEventBus().subscribe(this.newConfirmEvent(),
                    function() {
                        if (!this.isAttached()) {
                            return;
                        }
                        this.resetRegion();
                    }.bind(this));

            this.saveEventID = this.getEventBus().subscribe('save', function() {
                if (this.isAttached()) {
                    this.submitTestCase('Save');
                }
            }.bind(this));

            this.saveasEventID = this.getEventBus().subscribe('saveas', function() {
                if (this.isAttached()) {
                    this.submitTestCase('Saveas');
                }
            }.bind(this));

            this.openEventID = this.getEventBus().subscribe('open', function() {
                if (!this.isAttached()) {
                    return;
                }

                //destroy and recreate the dialog content to get the latest changes
                this.casesTable.destroy();
                this.casesTable = new dialogTable({
                    callback: function() {
                        this.openDialog.setContent(this.casesTable);
                        this.openDialog.show();
                    }.bind(this)
                });
            }.bind(this));

            this.deleteEventID = this.getEventBus().subscribe('delete', function() {
                if (!this.isAttached()) {
                    return;
                }
                this.deleteTestcase();
            }.bind(this));
        },

        unsubscribeEvents: function() {
            this.getEventBus().unsubscribe('new', this.newEventID);
            this.getEventBus().unsubscribe(this.newConfirmEvent,
                this.newConfirmEventID);
            this.getEventBus().unsubscribe('open', this.openEventID);
            this.getEventBus().unsubscribe('save', this.saveEventID);
            this.getEventBus().unsubscribe('saveas', this.saveasEventID);
            this.getEventBus().unsubscribe('delete', this.deleteEventID);
        },

        renderTestCase: function(testcase_id) {

            if (testcase_id) {
                aatlib.ajax({
                    url: '/api/test_case/' + testcase_id,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        var testcase = data.result.data,
                            sgsnmme = testcase.Parameters.SGSNMME_List,
                            uegroup = testcase.Parameters.UEgroup_List;
                        this.testCaseID = testcase_id;
                        this.savedTestCaseName = testcase.Test_Case_Name;
                        this.view.getCasesNameInput().setValue(this.savedTestCaseName);
                        this.view.getDescriptionInput().setValue(testcase.Info);
                        this.setSelectBoxVal(sgsnmme[0].type, sgsnmme[0].value);
                        this.setSelectBoxVal(uegroup[0].type, uegroup[0].value);
                        this.renderSelectedProcedureTable(testcase.Test_step_list);
                        this.getEventBus().publish('updateButtons');
                    }.bind(this)
                });
            }
        },

        renderSelectBox: function(type, placeholder) {

            this.selectBox[type] = new SelectBox({
                modifiers: [{
                    'name': 'width',
                    'value': 'medium'
                }]
            });
            this.selectBox[type].attachTo(placeholder);
            this.setSelectBox(type);
        },

        setSelectBox: function(type) {
            return aatlib.ajax({
                url: '/api/' + type,
                dataType: 'json',
                success: function(data) {
                    var items = data.result.map(function(item) {
                        var data = item.data;
                        return {
                            name: data.Name ? data.Name : data.NeName,
                            value: data.id,
                            title: data.Name ? data.Name : data.NeName,
                            number: data.Number_of_UEs ? data.Number_of_UEs : 0
                        };
                    });
                    this.selectBox[type].setItems(items);
                }.bind(this)
            });
        },

        setSelectBoxVal: function(type, value) {

            if (value === undefined) {
                this.selectBox[type].setValue({});
                return;
            }
            return aatlib.ajax({
                url: '/api/' + type + '/' + value,
                dataType: 'json',
                success: function(data) {
                    var item = data.result.data;
                    this.selectBox[type].setValue({
                        name: item.Name ? item.Name : item.NeName,
                        value: item.id,
                        title: item.Name ? item.Name : item.NeName,
                        number: item.Number_of_UEs ? item.Number_of_UEs : 0
                    });
                }.bind(this),
                error: function(msg, xhr) {
                    this.selectBox[type].setValue({});
                }.bind(this)
            });
        },

        createSelectedProcedureTable: function() {

            this.selectedProcedureTable = new Table({
                modifiers: [{
                    name: 'striped'
                }],
                columns: [{
                    title: 'Procedure Name',
                    attribute: 'procedure',
                    cellType: CellTitle,
                    width: '240px'
                }, {
                    title: 'Rate(times/sec)',
                    attribute: 'Rate',
                    width: '120px',
                    cellType: CellInput
                }, {
                    title: 'Throughput(kbps/UE)',
                    attribute: 'Throughput',
                    width: '150px',
                    cellType: CellInput
                }, {
                    title: 'Duration(sec)',
                    attribute: 'Duration',
                    width: '120px',
                    cellType: CellInput
                }, {
                    title: 'APN',
                    attribute: 'APN',
                    width: '90px',
                    cellType: APNSelectBox
                }, {
                    title: ' ',
                    attribute: 'delete',
                    width: '30px',
                    cellType: CellDelete
                }]
            });

            this.selectedProcedureTable.attachTo(this.view.getSelectedProcedureList());
        },

        createAllProcedureTable: function() {

            this.procedureTable = new Table({
                modifiers: [{
                    name: "striped"
                }],
                columns: [{
                    title: " ",
                    attribute: "Icon",
                    width: "30px",
                    cellType: CellArrow
                }, {
                    title: "Procedure Name",
                    attribute: "procedure",
                    cellType: CellTitle,
                    width: "250px"
                }, {
                    title: "Details",
                    attribute: "details",
                    width: "75px",
                    cellType: CellDetails
                }]
            });

            aatlib.ajax({
                url: '/api/instruction',
                dataType: 'json',
                success: function(data) {
                    var procedureData = data.result.map(function(procedure) {
                        var data = procedure.data,
                            parameters = {};
                        for (var key in data.Parameters) {
                            parameters[key] = {
                                'data': data.Parameters[key]
                            };
                            Object.assign(parameters[key], this.tableOptions[key]);
                        }
                        return Object.assign({
                            'procedure': data.Name,
                            'id': data.id,
                            'details': {
                                'Name': data.Name,
                                'Info': data.Info
                            }
                        }, parameters);
                    }.bind(this));
                    this.procedureTable.setData(procedureData);
                }.bind(this)
            });

            this.eProcedureTabCell =
                this.procedureTable.addEventHandler("cellClicked", function(selected) {
                    var data = JSON.parse(JSON.stringify(selected.getData()));
                    this.selectedProcedureTable.addRow(data);
                }.bind(this));
            this.procedureTable.attachTo(this.view.getAllProcedureList());
        },

        renderSelectedProcedureTable: function(procedures) {

            procedures.forEach(function(procedure) {
                var rowData = {
                        'procedure': procedure.Name,
                        'id': procedure.id,
                    },
                    parameters = procedure.Parameters;

                for (var key in parameters) {
                    rowData[key] = {
                        'data': parameters[key]
                    };
                    Object.assign(rowData[key], this.tableOptions[key]);
                }
                this.selectedProcedureTable.addRow(rowData);
            }.bind(this));
        },

        saveValidate: function() {

            var selectBoxValidation = true,
                inputValidation = true,
                procedureValidation = (this.selectedProcedureTable.getData().length !== 0);

            for (var key in this.selectBox) {
                selectBoxValidation = selectBoxValidation && this.selectBox[key].getValue().value;
            }
            this.selectedProcedureTable.getRows().forEach(function(row) {
                var selectBoxCell = row.getCells()[4].selectBox;
                if (selectBoxCell) {
                    selectBoxValidation = selectBoxValidation && (selectBoxCell.getValue().value !== undefined);
                }
            });
            this.view.getElement().findAll('input[required]').forEach(function(input) {

                inputValidation = inputValidation && input.getNative().validity.valid;
            });

            if (!selectBoxValidation) {
                this.getEventBus().publish('notify', 'Unable to save. Test case incomplete.', 'red');
                return true;
            }
            if (!inputValidation) {
                this.getEventBus().publish('notify', 'The input does not follow the expected format. Please correct fields marked in red before saving.', 'red');
                return true;
            }
            if (!procedureValidation) {
                this.getEventBus().publish('notify', 'The selected procedure table should not be empty.', 'red');
                return true;
            }
            if (this.selectBox["ue-group"].getValue().number > this.quota) {
                this.quotaDialog.show();
                return true;
            }
            return false;
        },

        submitTestCase: function(savetype) {

            if (this.saveValidate()) {
                return;
            }
            var requestData = {
                    'Test_Case_Name': this.getNameInput(),
                    'Test_Case_Type': 'load-test',
                    'Info': this.view.getDescriptionInput().getValue().trim(),
                    'Parameters': {
                        'SGSNMME_List': [{
                            'type': 'sgsn-mme',
                            'value': this.selectBox['sgsn-mme'].getValue().value
                        }],
                        'UEgroup_List': [{
                            'type': 'ue-group',
                            'value': this.selectBox['ue-group'].getValue().value
                        }]
                    },
                    'Test_step_list': this.selectedProcedureTable.getData().map(function(row) {
                        var data = {
                            'id': row.id,
                            'Name': row.procedure,
                            'type': 'instruction',
                            'Parameters': {}
                        };
                        for (var key in row) {
                            data.Parameters[key] = row[key].data;
                        }
                        return data;
                    })
                },
                requestUrl = '/api/test_case';
            if (savetype === 'Save' && this.testCaseID) {
                requestUrl += '/' + this.testCaseID;
            }
            aatlib.ajax({
                url: requestUrl,
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(requestData),
                success: function(data) {
                    this.testCaseID = data.result.data.id;
                    this.savedTestCaseName = this.getNameInput();
                    this.getEventBus().publish('updateButtons');
                    this.getEventBus().publish('notify', "Test Case " + this.getNameInput() + " Saved");
                }.bind(this),
                error: function(msg, xhr) {
                    switch (xhr.getStatus()) {
                        case 412:
                            this.saveFailed(xhr.getResponseJSON().result);
                            break;
                        default:
                            this.saveFailed("Saving failed with unexpected error: " + xhr.getStatus() + ' ' + xhr.getStatusText());
                    }
                }.bind(this)
            });

        },
        resetRegion: function() {
            // Reset page and back to the status when it's opened
            this.selectedProcedureTable.clear();
            this.view.getCasesNameInput().setValue('');
            this.view.getDescriptionInput().setValue('');
            this.selectBox['sgsn-mme'].setValue({});
            this.selectBox['ue-group'].setValue({});
            this.testCaseID = null;
            this.savedTestCaseName = null;
            this.getEventBus().publish('updateButtons');
        },

        getNameInput: function() {

            return this.view.getCasesNameInput().getValue().trim();
        },

        getSavedName: function() {
            return this.savedTestCaseName;
        },

        getSavedId: function() {

            return this.testCaseID;
        },

        saveFailed: function(errMsg) {
            var errLabel = 'Test Case Save failed';
            this.getEventBus().publish('notify', errLabel, 'red');
            var warnDialog = new Dialog({
                header: errLabel,
                content: errMsg,
                type: 'error',
                buttons: [{
                    caption: 'Close',
                    color: 'darkBlue',
                    action: function() {
                        warnDialog.hide();
                    }
                }],
                visible: true
            });
        },
        newConfirmEvent: function() {
            return 'buildLoadRegionNewConfirmed';
        },
    });
});