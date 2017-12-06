using Bailun.Common.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace Bailun.Finance.Web
{
    /// <summary>
    /// 定时任务
    /// </summary>
    public class TimerTaskConfig
    {
        //static string[] urlGenerateStaticPages = null;
        /// <summary>
        /// 定时任务
        /// </summary>
        public static void StartTimedTasks()
        {
            if (CustomConfig.TimedTasks[0] > 0)
            {
                StartGenerateStaticPage(CustomConfig.TimedTasks[0]);
            }
        }

        #region 生成静态页面     
        /// <summary>
        ///  生成静态页面任务
        /// </summary>
        /// <param name="intervalSeconds">任务间隔秒数</param>
        static void StartGenerateStaticPage(int intervalSeconds)
        {
            System.Timers.Timer objTimerRegister = new System.Timers.Timer();
            objTimerRegister.Interval = intervalSeconds * 1000;
            objTimerRegister.Enabled = true;
            objTimerRegister.Elapsed += new System.Timers.ElapsedEventHandler(GenerateStaticPage2);
        }
        /// <summary>
        /// 生成静态页面
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        static void GenerateStaticPage(object sender, System.Timers.ElapsedEventArgs e)
        {
            //1 市场快讯，2 财经日历，3 市场报价，4 宏观数据
            string url = "";
            switch (CustomConfig.WebSiteNo)
            {
                case "1":
                    url = CustomConfig.WebBailunNews + "/News/GenerateStaticPageNewsIndex";
                    break;
                case "2":
                    url = CustomConfig.WebBailunRili + "/Calendar/GenerateStaticPageCalendarIndex";
                    break;
                case "3":
                    url = CustomConfig.WebBailunBaojia + "/MarketPrice/GenerateStaticPageMarketPriceIndex";
                    break;
                case "4":
                    url = CustomConfig.WebBailunShuju + "/Indicator/GenerateStaticPageIndicatorIndex";
                    break;
                default:
                    break;
            }

            try
            {
                if (!string.IsNullOrEmpty(url))
                {
                    using (var webClient = new WebClient())
                    {
                        webClient.DownloadString(url);
                    }
                }
            }
            catch (Exception ex)
            {
                //LogsHelper.WriteCustomLog("staticpage", "Stone.Master.Web.TimerTaskConfig GenerateStaticPage Exception" + ex.Message, ex.ToString());
            }
        }

        /// <summary>
        /// 生成静态页面
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        static void GenerateStaticPage2(object sender, System.Timers.ElapsedEventArgs e)
        {
            //1 市场快讯，2 财经日历，3 市场报价，4 宏观数据
            try
            {
                //if (urlGenerateStaticPages == null)
                //    urlGenerateStaticPages = FileHelper.ReadTxt(string.Format("/Data/Txt/url_generatestaticpages_{0}.txt", CustomConfig.WebSiteNo)).ToArray();

                if (CustomConfig.GenerateStaticPages != null && CustomConfig.GenerateStaticPages.Length > 0)
                {
                    foreach (string url in CustomConfig.GenerateStaticPages)
                    {
                        try
                        {
                            if (!string.IsNullOrEmpty(url))
                            {
                                using (var webClient = new WebClient())
                                {
                                    webClient.DownloadString(url);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            //LogsHelper.WriteCustomLog("staticpage", "Stone.Master.Web.TimerTaskConfig GenerateStaticPage Exception" + ex.Message, ex.ToString());
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }
        }
        #endregion
    }
}