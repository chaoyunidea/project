/*!
 * ASP.NET SignalR JavaScript Library v2.2.2
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['ForexHub'] = this.createHubProxy('ForexHub'); 
        proxies['ForexHub'].client = { };
        proxies['ForexHub'].server = {
            sendForexJson: function (JsonContent) {
            /// <summary>Calls the SendForexJson method on the server-side ForexHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"JsonContent\" type=\"String\">Server side type is System.String</param>
                return proxies['ForexHub'].invoke.apply(proxies['ForexHub'], $.merge(["SendForexJson"], $.makeArray(arguments)));
             }
        };

        proxies['MT4Hub'] = this.createHubProxy('MT4Hub'); 
        proxies['MT4Hub'].client = { };
        proxies['MT4Hub'].server = {
            disSubscribeSymbole_Price: function (brokerIdString) {
            /// <summary>Calls the DisSubscribeSymbole_Price method on the server-side MT4Hub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"brokerIdString\" type=\"String\">Server side type is System.String</param>
                return proxies['MT4Hub'].invoke.apply(proxies['MT4Hub'], $.merge(["DisSubscribeSymbole_Price"], $.makeArray(arguments)));
             },

            disSubscribeSymbole_Spread: function (brokerIdString) {
            /// <summary>Calls the DisSubscribeSymbole_Spread method on the server-side MT4Hub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"brokerIdString\" type=\"String\">Server side type is System.String</param>
                return proxies['MT4Hub'].invoke.apply(proxies['MT4Hub'], $.merge(["DisSubscribeSymbole_Spread"], $.makeArray(arguments)));
             },

            registerClient: function (json) {
            /// <summary>Calls the RegisterClient method on the server-side MT4Hub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"json\" type=\"String\">Server side type is System.String</param>
                return proxies['MT4Hub'].invoke.apply(proxies['MT4Hub'], $.merge(["RegisterClient"], $.makeArray(arguments)));
             },

            subscribeSymbole_Price: function (brokerIdString) {
            /// <summary>Calls the SubscribeSymbole_Price method on the server-side MT4Hub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"brokerIdString\" type=\"String\">Server side type is System.String</param>
                return proxies['MT4Hub'].invoke.apply(proxies['MT4Hub'], $.merge(["SubscribeSymbole_Price"], $.makeArray(arguments)));
             },

            subscribeSymbole_Spread: function (brokerIdString) {
            /// <summary>Calls the SubscribeSymbole_Spread method on the server-side MT4Hub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"brokerIdString\" type=\"String\">Server side type is System.String</param>
                return proxies['MT4Hub'].invoke.apply(proxies['MT4Hub'], $.merge(["SubscribeSymbole_Spread"], $.makeArray(arguments)));
             }
        };

        proxies['NewsHub'] = this.createHubProxy('NewsHub'); 
        proxies['NewsHub'].client = { };
        proxies['NewsHub'].server = {
            sendNews: function (NewsContent) {
            /// <summary>Calls the SendNews method on the server-side NewsHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"NewsContent\" type=\"String\">Server side type is System.String</param>
                return proxies['NewsHub'].invoke.apply(proxies['NewsHub'], $.merge(["SendNews"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));