using Bailun.Common.Helper;
using Bailun.Finance.Web.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Bailun.Finance.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //定时任务
            TimerTaskConfig.StartTimedTasks();
        }
        protected void Application_BeginRequest()
        {
            //if(CustomConfig.CheckCookie)
            //{
            //    string cookieName = "bailunsiteck";
            //    string cookie = CookieHelper.GetCookie(cookieName);
            //    if (string.IsNullOrEmpty(cookie))
            //    {
            //        string source = Context.Request.FilePath.ToLower();
            //        if (source.IndexOf("b5t1d6l5s4h3p2y1m6m6k7a1d7x6y5w5l6d6j7s1z7z6l5z6z3c6z543213") > -1)
            //        {
            //            CookieHelper.SetCookie(cookieName, DateTime.Now.ToString(), "M", 3, true, "bailun.com");
            //        }
            //        else
            //        {
            //            Response.Redirect("https://www.bailun.com");
            //            Response.End();
            //        }
            //    }
            //}   
            // && DateTime.Now < DateTime.Parse("2017-11-22 19:58:00")
            //string filePath = Context.Request.FilePath;
            //if (CustomConfig.AccessVerification)
            //{
            //    if (!CookieService.GetOpenBetaCookie() && !CookieService.CheckRequestFilePath(filePath))
            //    {
            //        Response.Redirect("/account/invitationcode");
            //    }
            //}

            if (Context.Request.FilePath == "/")
                Context.RewritePath("index_kxrlbjsjkqd.html");
        }
        /// <summary>
        /// 在出现未处理的错误时运行的代码  
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Application_Error(object sender, EventArgs e)
        {

        }
    }
}
