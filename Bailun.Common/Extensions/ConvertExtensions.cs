using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Common.Extensions
{
    /// <summary>
    /// 
    /// </summary>
    public static class ConvertExtensions
    {
        /// <summary>
        /// 将以","为分隔符的字符串转换为int型数组
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static int[] ConvertToIntArray(this string value)
        {
            try
            {
                return Array.ConvertAll(value.Split(','), s => int.Parse(s));
            }
            catch
            {

            }
            return new int[] { };
        }

        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ConvertToMd5(this string value)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            return BitConverter.ToString(md5.ComputeHash(UTF8Encoding.Default.GetBytes(value))).Replace("-", "");
        }

        /// <summary>
        /// 转换为Decimal类型
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static decimal ConvertToDecimal(this string value)
        {
            decimal num;
            if (decimal.TryParse(value, out num))
                return num;
            return 0;
        }
        /// <summary>
        /// 将以","为分隔符的字符串转换为string数组
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string[] ConvertToStringArray(this string value)
        {
            try
            {
                return Array.ConvertAll(value.Split(','), s => s);
            }
            catch
            {

            }
            return new string[] { };
        }
        /// <summary>
        /// 将百分比转换成小数
        /// </summary>
        /// <param name="perc">百分比值，可纯为数值，或都加上%号的表示，
        /// 如：65|65%</param>
        /// <returns></returns>
        public static decimal PerctangleToDecimal(string perc)
        {
            try
            {
                //string patt = @"/(-?[0-9]\d*\.?\d*)/";
                //decimal percNum = Decimal.Parse(System.Text.RegularExpressions.Regex.Match(perc, patt).Groups[0].Value);
                //return percNum / (decimal)100;

               decimal newPerc =  perc.Replace("%", "").Replace("+","").ConvertToDecimal();
                if(newPerc==0)
                {
                    return 0;
                }
                else
                {
                    return newPerc / 100;
                }
            }
            catch
            {
                return 1;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ConvertEmptyString(this object value)
        {
            return value != null ? value.ToString() : string.Empty;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ConvertToEmpty(this object value)
        {
            return value != null ? value.ToString() : string.Empty;
        }
    }
}
