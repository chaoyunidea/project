using Bailun.Common.Extensions;
using Bailun.Common.Helper;
using System;
using System.Configuration;
using System.Web;
using System.Web.Configuration;

namespace Bailun.Finance.Web
{
    /// <summary>
    /// 自定义配置文件
    /// </summary>
    public static class CustomConfig
    {
        /// <summary>
        /// 
        /// </summary>
        static CustomConfig()
        {
            try
            {
                ExeConfigurationFileMap map = new ExeConfigurationFileMap();
                map.ExeConfigFilename = HttpContext.Current.Server.MapPath(WebConfigurationManager.AppSettings["CustomConfigFile"].ToString());
                Configuration config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

                ApiUserService = config.AppSettings.Settings["ApiUserService"] != null ? config.AppSettings.Settings["ApiUserService"].Value : "";
                ApiBaseService = config.AppSettings.Settings["ApiBaseService"] != null ? config.AppSettings.Settings["ApiBaseService"].Value : "";
                ApiMaster = config.AppSettings.Settings["ApiMaster"] != null ? config.AppSettings.Settings["ApiMaster"].Value : "";
                ApiHuixin = config.AppSettings.Settings["ApiHuixin"] != null ? config.AppSettings.Settings["ApiHuixin"].Value : "";
                ApiBailunNews = config.AppSettings.Settings["ApiBailunNews"] != null ? config.AppSettings.Settings["ApiBailunNews"].Value : "";
                ApiQuote = config.AppSettings.Settings["ApiQuote"] != null ? config.AppSettings.Settings["ApiQuote"].Value : "";
                ApiMacroeData= config.AppSettings.Settings["ApiMacroeData"] != null ? config.AppSettings.Settings["ApiMacroeData"].Value : "";

                WebBailun = config.AppSettings.Settings["WebBailun"] != null ? config.AppSettings.Settings["WebBailun"].Value : "";
                WebBailunNews = config.AppSettings.Settings["WebBailunNews"] != null ? config.AppSettings.Settings["WebBailunNews"].Value : "";
                WebBailunRili = config.AppSettings.Settings["WebBailunRili"] != null ? config.AppSettings.Settings["WebBailunRili"].Value : "";
                WebBailunBaojia = config.AppSettings.Settings["WebBailunBaojia"] != null ? config.AppSettings.Settings["WebBailunBaojia"].Value : "";
                WebBailunShuju = config.AppSettings.Settings["WebBailunShuju"] != null ? config.AppSettings.Settings["WebBailunShuju"].Value : "";
                WebMaster = config.AppSettings.Settings["WebMaster"] != null ? config.AppSettings.Settings["WebMaster"].Value : "";

                TimedTasks = config.AppSettings.Settings["TimedTasks"] != null ? config.AppSettings.Settings["TimedTasks"].Value.ConvertToIntArray() : new int[] { 0, 0 };
                Cnzz = config.AppSettings.Settings["Cnzz"] != null ? config.AppSettings.Settings["Cnzz"].Value : "";
                AccessVerification = config.AppSettings.Settings["AccessVerification"] != null && config.AppSettings.Settings["AccessVerification"].Value == "1";
                GenerateStaticPages= config.AppSettings.Settings["GenerateStaticPages"] != null ? config.AppSettings.Settings["GenerateStaticPages"].Value.ConvertToStringArray() : new string[] {  };
            }
            catch
            {

            }
        }
        /// <summary>
        /// 站点编号
        /// </summary>
        public static string WebSiteNo { get; } = WebConfigurationManager.AppSettings["WebSiteId"] != null ? WebConfigurationManager.AppSettings["WebSiteId"] : "";
        
        /// <summary>
        /// 用户服务Api
        /// </summary>
        public static string ApiUserService { get; }
        /// <summary>
        /// 基础服务Api
        /// </summary>
        public static string ApiBaseService { get; }
        /// <summary>
        /// 主站API
        /// </summary>
        public static string ApiMaster { get; }
        /// <summary>
        /// 汇信API
        /// </summary>
        public static string ApiHuixin { get; }
        /// <summary>
        /// 拜仑新闻、财经日历API
        /// </summary>
        public static string ApiBailunNews { get; }
        /// <summary>
        /// 宏观数据API
        /// </summary>
        public static string ApiMacroeData { get; }
        /// <summary>
        /// 报价API
        /// </summary>
        public static string ApiQuote { get; }
        /// <summary>
        /// 拜仑财经
        /// </summary>
        public static string WebBailun { get; }
        /// <summary>
        /// 市场快讯
        /// </summary>
        public static string WebBailunNews { get; }
        /// <summary>
        /// 财经日历
        /// </summary>
        public static string WebBailunRili { get; }
        /// <summary>
        /// 市场报价
        /// </summary>
        public static string WebBailunBaojia { get; }
        /// <summary>
        /// 宏观数据
        /// </summary>
        public static string WebBailunShuju { get; }
        /// <summary>
        /// 外汇110网
        /// </summary>
        public static string WebMaster { get; }
        /// <summary>
        /// 版本号
        /// </summary>
        public static string VersionNo { get; }
        /// <summary>
        /// 
        /// </summary>
        public static string Cnzz { get; set; }
        /// <summary>
        /// 访问验证
        /// </summary>
        public static bool AccessVerification { get; set; }
        /// <summary>
        /// 定时任务：【静态页生成,无】（0 不启动任务，大于0启动并按配置值间隔（秒）执行）
        /// </summary>
        public static int[] TimedTasks { get; set; }
        /// <summary>
        /// 生成静态页
        /// </summary>
        public static string[] GenerateStaticPages { get; }

    }
}
