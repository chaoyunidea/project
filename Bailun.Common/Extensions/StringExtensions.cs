using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Common.Extensions
{
    /// <summary>
    /// 
    /// </summary>
    public static class StringExtensions
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="priceLimit"></param>
        /// <param name="currentPrice"></param>
        /// <param name="openPrice"></param>
        /// <returns></returns>
        public static string CaculatePriceLimit(this string priceLimit, decimal currentPrice, decimal openPrice)
        {
            return priceLimit == "" ? string.Format(currentPrice - openPrice > 0 ? "+{0}" : "{0}", Math.Round(currentPrice - openPrice, 5))
                : priceLimit != null ? priceLimit : "0.00";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="priceLimit"></param>
        /// <param name="currentPrice"></param>
        /// <param name="openPrice"></param>
        /// <returns></returns>
        public static string CaculatePriceExchange(this string priceExchange, decimal currentPrice, decimal openPrice)
        {
            return priceExchange == "" ? string.Format(currentPrice - openPrice > 0 ? "+{0}%" : "{0}%", openPrice <= 0 ? 0 : Math.Round((currentPrice - openPrice) / openPrice * 100, 2))
                : priceExchange != null ? priceExchange : "0.00%";
        }

        /// <summary>
        /// 获取数组中最大值与最小值（默认返回 0）
        /// </summary>
        /// <param name="arr"></param>
        /// <returns></returns>
        public static string[] GeMaxMinValue(this string[] arr)
        {
            if (arr != null && arr.Length > 0)
            {
                List<decimal> list = new List<decimal>();
                foreach (string s in arr)
                {
                    list.Add(s.ConvertToDecimal());
                }
                return new string[] { list.Min().ToString(), list.Max().ToString() };
            }
            return new string[] { "0", "0" };
        }

        /// <summary>
        /// 获取数组中最大值与最小值（默认返回 0）
        /// </summary>
        /// <param name="arr"></param>
        /// <returns></returns>
        public static string[] GeMaxMinValue(this IList<string[]> arr)
        {
            if (arr != null && arr.Count > 0)
            {
                List<decimal> list = new List<decimal>();
                //for (int k = 1; k < arr.Count; k++)
                //{
                //    list.Add(arr[k][0].ConvertToDecimal());
                //}
                foreach (string[] s in arr)
                {
                    list.Add(s[0].ConvertToDecimal());
                }
                return new string[] { list.Min().ToString(), list.Max().ToString() };
            }
            return new string[] { "0", "0" };
        }

        ///<summary>
        ///生成随机字符串 
        ///</summary>
        ///<param name="length">目标字符串的长度</param>
        ///<param name="useNum">是否包含数字，1=包含，默认为包含</param>
        ///<param name="useLow">是否包含小写字母，1=包含，默认为包含</param>
        ///<param name="useUpp">是否包含大写字母，1=包含，默认为包含</param>
        ///<param name="useSpe">是否包含特殊字符，1=包含，默认为不包含</param>
        ///<param name="custom">要包含的自定义字符，直接输入要包含的字符列表</param>
        ///<returns>指定长度的随机字符串</returns>
        public static string GetRandomString(int length, bool useNum, bool useLow, bool useUpp, bool useSpe, string custom = "")
        {
            byte[] b = new byte[4];
            new System.Security.Cryptography.RNGCryptoServiceProvider().GetBytes(b);
            Random r = new Random(BitConverter.ToInt32(b, 0));
            string s = null, str = custom != null ? custom : "";
            if (useNum == true) { str += "0123456789"; }
            if (useLow == true) { str += "abcdefghijklmnopqrstuvwxyz"; }
            if (useUpp == true) { str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; }
            if (useSpe == true) { str += "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"; }
            for (int i = 0; i < length; i++)
            {
                s += str.Substring(r.Next(0, str.Length - 1), 1);
            }
            return s;
        }
    }
}
