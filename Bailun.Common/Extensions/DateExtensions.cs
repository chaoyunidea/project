using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Common.Extensions
{
    /// <summary>
    /// 时间扩展类
    /// </summary>
    public static class DateExtensions
    {
        /// <summary>       
        /// 时间戳转为C#格式时间    timeStamp=146471041000   
        /// </summary>           
        /// <returns></returns>       
        public static DateTime ConvertStringToDateTime(long time, int secondsOrMilliseconds = 0)
        {
            TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc));
            DateTime datetime = DateTime.MinValue;
            DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc));
            if (secondsOrMilliseconds == 1)
                datetime = startTime.AddSeconds(time);
            else
                datetime = startTime.AddMilliseconds(time);
            return datetime;
        }

        /// <summary>
        /// 时间类型转成long
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public static long ConvertDateTimeInt(DateTime datetime, int secondsOrMilliseconds = 0)
        {
            DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc));
            TimeSpan ts = (datetime - startTime);
            if (secondsOrMilliseconds == 1)
                return (long)ts.TotalSeconds;
            else
                return (long)ts.TotalMilliseconds;
        }

        /// <summary>
        /// 时间戳格式化为指定类型时间戳    timeStamp=146471041000  
        /// </summary>
        /// <param name="datetime"></param>
        /// <param name="dateType">时间类型（1:天;2:时;3:分）</param>
        /// <returns></returns>
        public static long ConvertDateTimeInt(long dateTime, short dateType)
        {
            var datelong = ConvertStringToDateTime(dateTime);
            switch (dateType)
            {
                case 1:
                    datelong = Convert.ToDateTime(datelong.ToString("yyyy-MM-dd 00:00:00"));
                    break;
                case 2:
                    datelong = Convert.ToDateTime(datelong.ToString("yyyy-MM-dd HH:00:00"));
                    break;
                case 3:
                    datelong = Convert.ToDateTime(datelong.ToString("yyyy-MM-dd HH:mm:00"));
                    break;

            }
            return ConvertDateTimeInt(datelong);
        }

        /// <summary>
        /// 转换北京时间（格式:HH:mm）
        /// </summary>
        /// <param name="time"></param>
        /// <param name="timezone">时区</param>
        /// <returns></returns>
        public static string ConvertDatetimeHourBeijing(this string time, string timezone)
        {
            try
            {
                int timeZone = int.Parse(timezone);
                return string.Format("{0:t}", DateTime.Parse(time).AddHours(-timeZone).AddHours(8));
            }
            catch
            {

            }
            return "";
        }

    }
}
