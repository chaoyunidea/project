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

        proxies['bitConHub'] = this.createHubProxy('bitConHub'); 
        proxies['bitConHub'].client = { };
        proxies['bitConHub'].server = {
        };

        proxies['bondsHub'] = this.createHubProxy('bondsHub'); 
        proxies['bondsHub'].client = { };
        proxies['bondsHub'].server = {
        };

        proxies['commodityFuturesHub'] = this.createHubProxy('commodityFuturesHub'); 
        proxies['commodityFuturesHub'].client = { };
        proxies['commodityFuturesHub'].server = {
        };

        proxies['ForexHub'] = this.createHubProxy('ForexHub'); 
        proxies['ForexHub'].client = { };
        proxies['ForexHub'].server = {
        };

        proxies['indexFuturesHub'] = this.createHubProxy('indexFuturesHub'); 
        proxies['indexFuturesHub'].client = { };
        proxies['indexFuturesHub'].server = {
        };

        proxies['major_IndicesHub'] = this.createHubProxy('major_IndicesHub'); 
        proxies['major_IndicesHub'].client = { };
        proxies['major_IndicesHub'].server = {
        };

        proxies['metalsFuturesHub'] = this.createHubProxy('metalsFuturesHub'); 
        proxies['metalsFuturesHub'].client = { };
        proxies['metalsFuturesHub'].server = {
        };

        proxies['mobileHub'] = this.createHubProxy('mobileHub'); 
        proxies['mobileHub'].client = { };
        proxies['mobileHub'].server = {
        };

        proxies['QuoteHub'] = this.createHubProxy('QuoteHub'); 
        proxies['QuoteHub'].client = { };
        proxies['QuoteHub'].server = {
            disSubscribeSymbol: function (symbol, quotetypedefine) {
            /// <summary>Calls the DisSubscribeSymbol method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quotetypedefine\" type=\"Object\">Server side type is FX110_Quotes_API.Enum.QuoteTypeDefine</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["DisSubscribeSymbol"], $.makeArray(arguments)));
             },

            mobileDisSubscribeSymbol: function (symbol) {
            /// <summary>Calls the MobileDisSubscribeSymbol method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["MobileDisSubscribeSymbol"], $.makeArray(arguments)));
             },

            mobileDisSubscribeSymbol_ChartLine: function (symbol, resolution) {
            /// <summary>Calls the MobileDisSubscribeSymbol_ChartLine method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"resolution\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["MobileDisSubscribeSymbol_ChartLine"], $.makeArray(arguments)));
             },

            mobileSubscribeSymbol: function (symbol) {
            /// <summary>Calls the MobileSubscribeSymbol method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["MobileSubscribeSymbol"], $.makeArray(arguments)));
             },

            mobileSubscribeSymbol_ChartLine: function (symbol, resolution) {
            /// <summary>Calls the MobileSubscribeSymbol_ChartLine method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"resolution\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["MobileSubscribeSymbol_ChartLine"], $.makeArray(arguments)));
             },

            sendBitCon: function (symbol, quote) {
            /// <summary>Calls the SendBitCon method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendBitCon"], $.makeArray(arguments)));
             },

            sendBonds: function (symbol, quote) {
            /// <summary>Calls the SendBonds method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendBonds"], $.makeArray(arguments)));
             },

            sendChartLine: function (symbol, resolution, chartbar) {
            /// <summary>Calls the SendChartLine method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"resolution\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"chartbar\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendChartLine"], $.makeArray(arguments)));
             },

            sendCommodityFutures: function (symbol, quote) {
            /// <summary>Calls the SendCommodityFutures method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendCommodityFutures"], $.makeArray(arguments)));
             },

            sendForex: function (symbol, quote) {
            /// <summary>Calls the SendForex method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendForex"], $.makeArray(arguments)));
             },

            sendFranceStock: function (symbol, quote) {
            /// <summary>Calls the SendFranceStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendFranceStock"], $.makeArray(arguments)));
             },

            sendGermanyStock: function (symbol, quote) {
            /// <summary>Calls the SendGermanyStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendGermanyStock"], $.makeArray(arguments)));
             },

            sendHongKongStock: function (symbol, quote) {
            /// <summary>Calls the SendHongKongStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendHongKongStock"], $.makeArray(arguments)));
             },

            sendIndexFutures: function (symbol, quote) {
            /// <summary>Calls the SendIndexFutures method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendIndexFutures"], $.makeArray(arguments)));
             },

            sendIndiaStock: function (symbol, quote) {
            /// <summary>Calls the SendIndiaStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendIndiaStock"], $.makeArray(arguments)));
             },

            sendJapanStock: function (symbol, quote) {
            /// <summary>Calls the SendJapanStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendJapanStock"], $.makeArray(arguments)));
             },

            sendMajor_Indices: function (symbol, quote) {
            /// <summary>Calls the SendMajor_Indices method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendMajor_Indices"], $.makeArray(arguments)));
             },

            sendMetalsFutures: function (symbol, quote) {
            /// <summary>Calls the SendMetalsFutures method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendMetalsFutures"], $.makeArray(arguments)));
             },

            sendMexicoStock: function (symbol, quote) {
            /// <summary>Calls the SendMexicoStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendMexicoStock"], $.makeArray(arguments)));
             },

            sendRussiaStock: function (symbol, quote) {
            /// <summary>Calls the SendRussiaStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendRussiaStock"], $.makeArray(arguments)));
             },

            sendThailandStock: function (symbol, quote) {
            /// <summary>Calls the SendThailandStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendThailandStock"], $.makeArray(arguments)));
             },

            sendUkraineStock: function (symbol, quote) {
            /// <summary>Calls the SendUkraineStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendUkraineStock"], $.makeArray(arguments)));
             },

            sendUKStock: function (symbol, quote) {
            /// <summary>Calls the SendUKStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendUKStock"], $.makeArray(arguments)));
             },

            sendUSStock: function (symbol, quote) {
            /// <summary>Calls the SendUSStock method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quote\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SendUSStock"], $.makeArray(arguments)));
             },

            subscribeSymbol: function (symbol, quotetypedefine) {
            /// <summary>Calls the SubscribeSymbol method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbol\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"quotetypedefine\" type=\"Object\">Server side type is FX110_Quotes_API.Enum.QuoteTypeDefine</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["SubscribeSymbol"], $.makeArray(arguments)));
             },

            webSiteDisSubscribeSymbol: function (symbols) {
            /// <summary>Calls the WebSiteDisSubscribeSymbol method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbols\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["WebSiteDisSubscribeSymbol"], $.makeArray(arguments)));
             },

            webSiteSubscribeSymbol: function (symbols) {
            /// <summary>Calls the WebSiteSubscribeSymbol method on the server-side QuoteHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"symbols\" type=\"String\">Server side type is System.String</param>
                return proxies['QuoteHub'].invoke.apply(proxies['QuoteHub'], $.merge(["WebSiteSubscribeSymbol"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));