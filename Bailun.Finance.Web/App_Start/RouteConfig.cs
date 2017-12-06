using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Bailun.Common.Helper;

namespace Bailun.Finance.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // routes.Add(
            //  "BaojiaDomainRouteLocal", new DomainRoute(
            //  "localbj.bailun.com",
            //  "{controller}/{action}/{id}",
            //  new { controller = "MarketPrice", action = "Index", id = UrlParameter.Optional }
            //));
            // routes.Add(
            //  "RiliDomainRouteLocal", new DomainRoute(
            //  "localrl.bailun.com",
            //  "{controller}/{action}/{id}",
            //  new { controller = "Calendar", action = "Index", id = UrlParameter.Optional }
            //));
            // routes.Add(
            //  "NewsDomainRouteLocal", new DomainRoute(
            //  "localnews.bailun.com",
            //  "{controller}/{action}/{id}",
            //  new { controller = "News", action = "Index", id = UrlParameter.Optional }
            //));

            // routes.Add(
            //  "NewsDomainRoute", new DomainRoute(
            //  "news.bailun.com",
            //  "{controller}/{action}/{id}",
            //  new { controller = "News", action = "Index", id = UrlParameter.Optional }
            //));
            // routes.Add(
            //  "BaojiaDomainRoute", new DomainRoute(
            //  "baojia.bailun.com",
            //  "{controller}/{action}/{id}",
            //  new { controller = "MarketPrice", action = "Index", id = UrlParameter.Optional }
            //));
            // routes.Add(
            //  "RiliDomainRoute", new DomainRoute(
            //  "rili.bailun.com",
            //  "{controller}/{action}/{id}",
            //  new { controller = "Calendar", action = "Index", id = UrlParameter.Optional }
            //));

            //routes.Add(
            //    "DomainRoute", new DomainRoute(
            //    "{CityNameUrl}.bailun.com",
            //    "{controller}/{action}/{id}",
            //    new { CityNameUrl = "", controller = "City", action = "Index", id = "" }
            //));

            routes.MapRoute(
              "Calendar_Detail",
              "calendar/unscramble/{sourceId}_{unscrambleId}_{date}",
              new { controller = "calendar", action = "detail", sourceId = @"d", unscrambleId = @"d", date = @"d" }
            );
            routes.MapRoute(
            "marketprice_List",
            "marketprice/list/{type}",
            new { controller = "marketprice", action = "pricelist", type = @"d" }
          );
            routes.MapRoute(
             "marketprice_Detail",
             "marketprice/chart/{id}",
             new { controller = "marketprice", action = "detail", id = @"d" }
           );
            if (ConfigHelper.WebSiteId == "2")
            {
                //财经日历
                routes.MapRoute(
                    name: "Default",
                    url: "{controller}/{action}/{id}",
                    defaults: new { controller = "Calendar", action = "Index", id = UrlParameter.Optional }
                );
            }
            else if (ConfigHelper.WebSiteId == "3")
            {
                //市场报价
                routes.MapRoute(
                    name: "Default",
                    url: "{controller}/{action}/{id}",
                    defaults: new { controller = "MarketPrice", action = "Index", id = UrlParameter.Optional }
                );
            }
            else if (ConfigHelper.WebSiteId == "4")
            {
                //宏观数据
                routes.MapRoute(
                    name: "Default",
                    url: "{controller}/{action}/{id}",
                    defaults: new { controller = "Indicator", action = "Index", id = UrlParameter.Optional }
                );
            }
            else
            {
                //市场快讯
                routes.MapRoute(
                    name: "Default",
                    url: "{controller}/{action}/{id}",
                    defaults: new { controller = "News", action = "Index", id = UrlParameter.Optional }
                );
            }
        }
    }
}
