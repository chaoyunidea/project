using Bailun.Common.Extensions;
using Bailun.Common.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bailun.Finance.Web.Service
{
    public class CookieService
    {
        private static string betaCookieName = "betainvitationcode";
        private static string betaCookieKey = "FASFSA242GSA9OQRWONGGASG";

        private static string[] excludeUrl = FileHelper.ReadLineTxt("/Data/Txt/exclude_url.txt").ToArray();
        /// <summary>
        /// 验证公测cookie
        /// </summary>
        /// <returns></returns>
        public static bool GetOpenBetaCookie()
        {
            string cookieValue = CookieHelper.GetCookie(betaCookieName);
            if (!string.IsNullOrEmpty(cookieValue))
            {
                string[] value = cookieValue.Split('_');
                if (value.Length == 2)
                {
                    if ((value[0] + betaCookieKey).ConvertToMd5() == value[1])
                    {
                        return true;
                    }
                }
            }
            return false;
        }
        /// <summary>
        /// 设置公测cookie
        /// </summary>
        /// <returns></returns>
        public static void SetOpenBetaCookie(string invitationCode)
        {
            string value = string.Format("{0}_{1}", invitationCode, (invitationCode + betaCookieKey).ConvertToMd5());
            CookieHelper.SetCookie(betaCookieName, value, "M", 2, true, "bailun.com");
        }
        /// <summary>
        /// 排除url
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static bool CheckRequestFilePath(string path)
        {
            path = path != null ? path.ToLower() : "";
            foreach (string s in excludeUrl)
            {
                if (path.Contains(s))
                {
                    return true;
                }
            }
            return false;
        }
    }
}