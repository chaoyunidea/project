using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Bailun.Common.Helper
{
    /// <summary>
    /// Cookie操作类
    /// </summary>
    public static class CookieHelper
    {

        /// <summary>
        /// 删除Cookie
        /// </summary>
        /// <param name="name"></param>
        /// <param name="domain"></param>
        public static void Delete(string name, string domain)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[name];
            if (cookie != null)
            {
                if (!string.IsNullOrEmpty(domain))
                {
                    cookie.Domain = domain;
                }
                cookie.Expires = DateTime.Now.AddHours(-1);
                HttpContext.Current.Response.Cookies.Add(cookie);
            }
        }
        /// <summary>
        /// 设置cookie 。eType: s 秒 m 分，h 时，d 天，M 月，y 年
        /// </summary>
        /// <param name="cookiename">cookie名称</param>
        /// <param name="value">值</param>
        /// <param name="expirestype">有效期类型 s 秒 m 分，h 时，d 天，M 月，y 年</param>
        /// <param name="expires">有效期 分钟</param>
        /// <param name="httponly">客户端脚本访问</param>
        public static void SetCookie(string cookieName, string value, string eType, int expires, bool httponly)
        {
            HttpCookie cookie = new HttpCookie(cookieName);
            cookie.Value = value;
            cookie.HttpOnly = httponly;
            switch (eType)
            {
                case "s":
                    cookie.Expires = DateTime.Now.AddSeconds(expires);
                    break;
                case "m":
                    cookie.Expires = DateTime.Now.AddMinutes(expires);
                    break;
                case "h":
                    cookie.Expires = DateTime.Now.AddHours(expires);
                    break;
                case "d":
                    cookie.Expires = DateTime.Now.AddDays(expires);
                    break;
                case "M":
                    cookie.Expires = DateTime.Now.AddMonths(expires);
                    break;
                default:
                    cookie.Expires = DateTime.Now.AddYears(expires);
                    break;
            }
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
        /// <summary>
        /// 设置cookie 。eType: s 秒 m 分，h 时，d 天，M 月，y 年
        /// </summary>
        /// <param name="cookiename">cookie名称</param>
        /// <param name="value">值</param>
        /// <param name="expirestype">有效期类型 s 秒 m 分，h 时，d 天，M 月，y 年</param>
        /// <param name="expires">有效期 分钟</param>
        /// <param name="httponly">客户端脚本访问</param>
        /// <param name="domain">域</param>
        public static void SetCookie(string cookieName, string value, string eType, int expires, bool httponly, string domain)
        {
            HttpCookie cookie = new HttpCookie(cookieName);

            cookie.Value = HttpUtility.UrlEncode(value);
            cookie.HttpOnly = httponly;
            switch (eType)
            {
                case "s":
                    cookie.Expires = DateTime.Now.AddSeconds(expires);
                    break;
                case "m":
                    cookie.Expires = DateTime.Now.AddMinutes(expires);
                    break;
                case "h":
                    cookie.Expires = DateTime.Now.AddHours(expires);
                    break;
                case "d":
                    cookie.Expires = DateTime.Now.AddDays(expires);
                    break;
                case "M":
                    cookie.Expires = DateTime.Now.AddMonths(expires);
                    break;
                default:
                    cookie.Expires = DateTime.Now.AddYears(expires);
                    break;
            }
            if (!string.IsNullOrEmpty(domain))
                cookie.Domain = domain;


            HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.UTF8;
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
        /// <summary>
        /// 获取Cookie的value值
        /// </summary>
        /// <param name="cookieName"></param>
        /// <returns></returns>
        public static string GetCookie(string cookieName)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[cookieName];
            return cookie != null ? cookie.Value : null;
        }
    }
}
