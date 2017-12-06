using Bailun.Common.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Common.Helper
{
    /// <summary>
    /// 日志帮助类
    /// </summary>
    public static class LogsHelper
    {
        private static readonly object lockErrorLog = new object();
        private static readonly object lockOperateLog = new object();
        private static readonly object lockCustomLog = new object();
        private static readonly string path = AppDomain.CurrentDomain.BaseDirectory + "Data\\Logs\\";
        //private static readonly bool enableLogs = !string.IsNullOrEmpty(ConfigHelper.GetWebConfigKey("EnableLogs"));
        private static readonly bool enableLogs = true;

        /// <summary>
        /// 自定义日志文件名随机字符串
        /// </summary>
        private static string LogRandomString { get; set; } = StringExtensions.GetRandomString(8, true, true, false, false);
        /// <summary>
        /// 错误日志文件名随机字符串
        /// </summary>
        private static string ErrorLogRandomString { get; set; } = StringExtensions.GetRandomString(8, true, true, false, false);
        /// <summary>
        /// 操作日志文件名随机字符串
        /// </summary>
        private static string OperateLogRandomString { get; set; } = StringExtensions.GetRandomString(8, true, true, false, false);
        /// <summary>
        /// 自定义日志文件名随机字符串
        /// </summary>
        private static string CustomLogRandomString { get; set; } = StringExtensions.GetRandomString(8, true, true, false, false);

        /// <summary>
        /// 写入自定义日志
        /// </summary>
        /// <param name="title">日志标题</param>
        /// <param name="content">日志内容</param>
        /// <param name="fileName">自定义日志文件名</param>
        public static void WriteLog(string title, string content, string fileName = "default")
        {
            if (enableLogs)
            {
                lock (lockCustomLog)
                {
                    try
                    {
                        if (!string.IsNullOrEmpty(path))
                        {
                            if (!Directory.Exists(path))
                                Directory.CreateDirectory(path);

                            string date = DateTime.Now.ToString("yyyyMMdd");
                            string filePath = path + date + "_log_" + fileName + "_" + LogRandomString + ".txt";
                            if (!File.Exists(filePath))
                            {
                                LogRandomString = StringExtensions.GetRandomString(8, true, true, false, false);
                                filePath = path + date + "_log_" + fileName + "_" + LogRandomString + ".txt";
                                FileStream fs = File.Create(filePath);
                                fs.Close();
                            }
                            if (File.Exists(filePath))
                            {
                                StreamWriter sw = new StreamWriter(filePath, true, Encoding.Default);
                                sw.WriteLine(DateTime.Now);
                                sw.WriteLine(title);
                                sw.WriteLine(content);
                                sw.WriteLine();
                                sw.Close();
                            }
                        }
                    }
                    catch
                    {

                    }
                }
            }
        }
        /// <summary>
        /// 写入操作日志
        /// </summary>
        /// <param name="title"></param>
        /// <param name="content"></param>
        public static void WriteOperateLog(string title, string content)
        {
            if (enableLogs)
            {
                lock (lockOperateLog)
                {
                    try
                    {
                        if (!string.IsNullOrEmpty(path))
                        {
                            if (!Directory.Exists(path))
                                Directory.CreateDirectory(path);

                            string date = string.Format("{0:yyyyMMdd}", DateTime.Now);
                            string filePath = path + date + "_operate_" + OperateLogRandomString + ".txt";
                            if (!File.Exists(filePath))
                            {
                                OperateLogRandomString = StringExtensions.GetRandomString(8, true, true, false, false);
                                filePath = path + date + "_operate_" + OperateLogRandomString + ".txt";
                                FileStream fs = File.Create(filePath);
                                fs.Close();
                            }
                            if (File.Exists(filePath))
                            {
                                StreamWriter sw = new StreamWriter(filePath, true, Encoding.Default);
                                sw.WriteLine(DateTime.Now);
                                sw.WriteLine(title);
                                sw.WriteLine(content);
                                sw.WriteLine();
                                sw.Close();
                            }
                        }
                    }
                    catch
                    {

                    }
                }
            }
        }
        /// <summary>
        /// 写入错误日志
        /// </summary>
        /// <param name="title">日志标题</param>
        /// <param name="content">日志内容</param>
        public static void WriteErrorLog(string title, string content)
        {
            if (enableLogs)
            {
                lock (lockErrorLog)
                {
                    try
                    {
                        if (!string.IsNullOrEmpty(path))
                        {
                            if (!Directory.Exists(path))
                                Directory.CreateDirectory(path);

                            string date = DateTime.Now.ToString("yyyyMMdd");
                            string filePath = path + date + "_error_" + ErrorLogRandomString + ".txt";
                            if (!File.Exists(filePath))
                            {
                                ErrorLogRandomString = StringExtensions.GetRandomString(8, true, true, false, false);
                                filePath = path + date + "_error_" + ErrorLogRandomString + ".txt";
                                FileStream fs = File.Create(filePath);
                                fs.Close();
                            }
                            if (File.Exists(filePath))
                            {
                                StreamWriter sw = new StreamWriter(filePath, true, Encoding.Default);
                                sw.WriteLine(DateTime.Now);
                                sw.WriteLine(title);
                                sw.WriteLine(content);
                                sw.WriteLine();
                                sw.Close();
                            }
                        }
                    }
                    catch
                    {

                    }
                }
            }
        }
        /// <summary>
        /// 写入自定义日志
        /// </summary>
        /// <param name="fileName">自定义日志文件名</param>
        /// <param name="title">日志标题</param>
        /// <param name="content">日志内容</param>
        public static void WriteCustomLog(string fileName, string title, string content)
        {
            if (enableLogs)
            {
                lock (lockCustomLog)
                {
                    try
                    {
                        if (!string.IsNullOrEmpty(path))
                        {
                            if (!Directory.Exists(path))
                                Directory.CreateDirectory(path);

                            string date = DateTime.Now.ToString("yyyyMMdd");
                            string filePath = path + date + "_custom_" + fileName + "_" + CustomLogRandomString + ".txt";
                            if (!File.Exists(filePath))
                            {
                                CustomLogRandomString = StringExtensions.GetRandomString(8, true, true, false, false);
                                filePath = path + date + "_custom_" + fileName + "_" + CustomLogRandomString + ".txt";
                                FileStream fs = File.Create(filePath);
                                fs.Close();
                            }
                            if (File.Exists(filePath))
                            {
                                StreamWriter sw = new StreamWriter(filePath, true, Encoding.Default);
                                sw.WriteLine(DateTime.Now);
                                sw.WriteLine(title);
                                sw.WriteLine(content);
                                sw.WriteLine();
                                sw.Close();
                            }
                        }
                    }
                    catch
                    {

                    }
                }
            }
        }
    }
}
