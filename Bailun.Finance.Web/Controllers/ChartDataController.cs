using Bailun.Common.Helper;
using Bailun.Finance.Model.Quote;
using Bailun.Finance.Web.Service;
using Bailun.Finance.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace Bailun.Finance.Web.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class ChartDataController : Controller
    {
        public ActionResult Config()
        {
            try
            {
                var str = HttpRequestHelper.GetRequest(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "config"), null);
                return Content(str);
            }
            catch
            {
            }
            return Content("");
        }

        public ActionResult Marks(string symbol, string from, string to, string resolution)
        {
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("symbol", symbol);
                parms.Add("from", from);
                parms.Add("to", to);
                parms.Add("resolution", resolution);
                var str = HttpRequestHelper.GetRequest(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "marks"), parms);
                return Content(str);
            }
            catch
            {
            }
            return Content("");
        }

        
        public ActionResult History(string symbol, string from, string to, string resolution)
        {
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("symbol", symbol);
                parms.Add("from", from);
                parms.Add("to", to);
                parms.Add("resolution", resolution);
                var str = HttpRequestHelper.GetRequest(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "history"), parms);
                return Content(str);
            }
            catch
            {
            }
            return Content("");
        }

        public ActionResult Timescale_marks(string symbol, string from, string to, string resolution)
        {
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("symbol", symbol);
                parms.Add("from", from);
                parms.Add("to", to);
                parms.Add("resolution", resolution);
                var str = HttpRequestHelper.GetRequest(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "timescale_marks"), parms);
                return Content(str);
            }
            catch
            {
            }
            return Content("");
        }

        public ActionResult Search(string limit, string query, string type, string exchange)
        {
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("limit", limit);
                parms.Add("query", query);
                parms.Add("type", type);
                parms.Add("exchange", exchange);
                var str = HttpRequestHelper.GetRequest(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "search"), parms);
                return Content(str);
            }
            catch
            {
            }
            return Content("");
        }

        public ActionResult Symbols(string symbol)
        {
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("symbol", HttpUtility.UrlEncode(symbol));                
                var str = HttpRequestHelper.GetRequest(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "symbols"), parms);
                return Content(str);
            }
            catch
            {
            }
            return Content("");
        }


        public ActionResult Time()
        {
            try
            {
                var str = HttpRequestHelper.GetRequest(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "time"), null);
                return View(str);
            }
            catch
            {
            }
            return Content("");
        }

        public ActionResult Symbol_info(string group)
        {
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("group", group);
                var str = HttpRequestHelper.GetRequest(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "symbol_info"), null);
                return Content(str);
            }
            catch
            {
            }
            return Content("");
        }





    }
}