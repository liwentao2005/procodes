define([
        'jscore/ext/net',
        'jscore/ext/locationController',
        'aatlibrary/Sharedata'
], function(net, LocationController, sharedata) {

    'use strict'
    return {
        ajax: function(options) {

            var ajaxReq = {
                    url: options.url,
                    type: options.type,
                    data: options.data,
                    dataType: options.dataType,
                    success: options.success,
                    error: options.error
                },
                lc,
                apiKey,
                adapter;

            if (ajaxReq.url !== '/api/login') {
                apiKey = sharedata.getApiKey();
                adapter = sharedata.getAdapter();
                if (!apiKey) {
                    //redirect to login page
                    lc = new LocationController();
                    lc.setLocation('#login?failReason=1');
                    return;
                }
                if (this._is_sut(ajaxReq.url)) {
                    ajaxReq.url = this.addAdapter(ajaxReq.url, 'sut');
                } else if (!this._is_common_resource(ajaxReq.url)) {
                    ajaxReq.url = this.addAdapter(ajaxReq.url, adapter);
                }
                ajaxReq.url = this.setUrlParam(ajaxReq.url, 'api_key', encodeURIComponent(apiKey)); options.dataType || (ajaxReq.dataType = 'json'); options.type || (ajaxReq.type = 'GET');
            }
            net.ajax(ajaxReq);
        },

        _is_resource_in: function(url, resourceList) {
            return resourceList.some(function(resource) {
                var matchStr = '/api/'+resource;
                return matchStr === url || (url.indexOf(matchStr+"?") === 0) || (url.indexOf(matchStr+"/") === 0); 
            });
        },

        _is_sut: function(url) {
            return this._is_resource_in(url, sharedata.getSUTs());
        },

        _is_common_resource: function(url) {
            var commonResources = ['aat_configuration', 'ifs', 'adapter_config', 'network_config', 'sut'];
            return this._is_resource_in(url, commonResources);
        },

        detachIfNotLogin: function(app) {
            if (!sharedata.isLogin()) {
               var lc = new LocationController();
               app.detach();
               app.initialized = false;
               lc.setLocation('#login');
               return true;
            }
            return false;
        },

        setUrlParam: function(url, paramName, paramVal) {

            var separator = url.indexOf('?') === -1 ? '?' : '&';
            return (url + separator + paramName + '=' + paramVal);
        },

        addAdapter: function(url, adapter) {

            var subUrl = url.slice(4);
            return '/api/' + adapter + subUrl;
        }
    };
});
