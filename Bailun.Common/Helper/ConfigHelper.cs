using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace Bailun.Common.Helper
{
    /// <summary>
    /// 配置文件操作类
    /// </summary>
    public static class ConfigHelper
    {
        /// <summary>
        /// 站点标识ID（1 市场快讯，2 财经日历，3 市场报价，4 宏观数据）
        /// </summary>
        public static string WebSiteId { get; } = WebConfigurationManager.AppSettings["WebSiteId"] != null ? WebConfigurationManager.AppSettings["WebSiteId"] : "";
        /// <summary>
        /// 获取Web.config中appkey值
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetWebConfigKey(string key)
        {
            return WebConfigurationManager.AppSettings[key].ToString();
        }
        /// <summary>
        /// 根据传入路径的config文件获取key值
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetCustomConfigKey(string path, string appkey)
        {
            ExeConfigurationFileMap map = new ExeConfigurationFileMap();
            map.ExeConfigFilename = HttpContext.Current.Server.MapPath(path);
            Configuration config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);
            return config.AppSettings.Settings[appkey].Value;
        }
        /// <summary>
        /// 根据传入路径修改指定的配置文件， 返回1就代表成功!
        /// </summary>
        /// <param name="count"></param>
        /// <returns></returns>
        public static string SetCustomConfigKey(string path, string appkey, string value)
        {
            try
            {
                ExeConfigurationFileMap map = new ExeConfigurationFileMap();
                map.ExeConfigFilename = HttpContext.Current.Server.MapPath(path);
                Configuration config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);
                config.AppSettings.Settings[appkey].Value = value;
                config.Save();
                return "1";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }
}
