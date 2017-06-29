define([
    'jscore/ext/net'
], function(net) {

    return {
        setApiKey: function(k) {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            window.aatDataStorage.api_key = k;
        },

        getApiKey: function() {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            return window.aatDataStorage.api_key;
        },

        isLogin: function() {
            return !(this.getApiKey() === undefined);
        },

        clearApiKey: function() {
            this.setApiKey(undefined);
        },

        setAdapter: function(name) {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            return window.aatDataStorage.adapter = name;
        },

        getAdapter: function() {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            return window.aatDataStorage.adapter;
        },

        getAdapterName: function() {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            return window.aatDataStorage.adapterMap[window.aatDataStorage.adapter];
        },

        setRegionResetIndicator: function(name, trueOrFalse) {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            typeof(window.aatDataStorage.regionResetIndicator) === 'object' || (window.aatDataStorage.regionResetIndicator = {});
            return window.aatDataStorage.regionResetIndicator[name] = trueOrFalse;
        },

        getRegionResetIndicator: function() {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            typeof(window.aatDataStorage.regionResetIndicator) === 'object' || (window.aatDataStorage.regionResetIndicator = {});
            return window.aatDataStorage.regionResetIndicator;
        },

        getAdapterMap: function() {
            return window.aatDataStorage.adapterMap;
        },

        setAdapterMap: function(map) {
            window.aatDataStorage.adapterMap = map;
        },

        getAdapterConfig: function() {
            return window.aatDataStorage.adapterConfig;
        },

        setAdapterConfig: function(config) {
            window.aatDataStorage.adapterConfig = config;
        },

        setSocketConnect: function(testenvir, testexe) {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});

            window.aatDataStorage.socket = {
                testenvironment: testenvir,
                testexecution: testexe
            }
        },

        isMsg4CurrentAdapter: function(data) {
            try {
                var msg = JSON.parse(data);
                if ((msg.adapter === this.getAdapter()) || (msg.adapter.length === 0)) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                console.log("parse Json error:" + data);
                return false;
            }
        },

        getEnvirSocket: function() {
            typeof(window.aatDataStorage.socket) === 'object' || (window.aatDataStorage.socket = {});
            return window.aatDataStorage.socket.testenvironment;
        },

        getExeSocket: function() {
            typeof(window.aatDataStorage.socket) === 'object' || (window.aatDataStorage.socket = {});
            return window.aatDataStorage.socket.testexecution;
        },

        getTitle: function(resourceType) {
            switch (resourceType) {
                // this mapping is for legacy resource types, 
                // new added resource type should go to default case
                case 'ue':
                    return 'UE';
                case 'rnc':
                    return 'RNC';
                case 'enodeb':
                    return 'eNodeB';
                case 'sgsn-mme':
                    return 'SGSN-MME';
                case 'apn':
                    return 'APN';
                case 'ue-group':
                    return 'UE Group';
                case 'enodeb-group':
                    return 'eNodeB Group';
                default:
                    return resourceType;
            }
        },

        setSUTs: function(SUTs) {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            window.aatDataStorage.SUTs = SUTs;
        },

        getSUTs: function() {
            return window.aatDataStorage.SUTs === undefined ? [] : window.aatDataStorage.SUTs;
        },

        setResourceMap: function(resourceMap) {
            typeof(window.aatDataStorage) === 'object' || (window.aatDataStorage = {});
            window.aatDataStorage.resourceMap = resourceMap;
        },

        getResourceList: function() {
            var resourceList = window.aatDataStorage.resourceMap[this.getAdapter()];
            return resourceList === undefined ? [] : resourceList;
        },


    };
});