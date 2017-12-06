using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Bailun.Common.Helper
{
    /// <summary>
    /// 
    /// </summary>
    public static class FileHelper
    {

        #region 文件
        /// <summary>
        /// 获取服务器路径
        /// </summary>
        /// <returns></returns>
        public static string GetServerPath(string filePath)
        {
            string path = filePath.Replace("/", "\\");
            if (path.StartsWith("\\"))
                path = path.TrimStart('\\');
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
        }
        /// <summary>
        /// 文件是否存在
        /// </summary>
        /// <param name="filePath">虚拟路径</param>
        /// <returns></returns>
        public static bool FileExists(string filePath)
        {
            string serverPath = GetServerPath(filePath);
            return File.Exists(serverPath);
        }
        #endregion

        #region Txt
        /// <summary>
        ///  读取txt内容
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns></returns>
        public static string ReadTxt(string filePath)
        {
            string serverPath = GetServerPath(filePath);
            //return new StreamReader(serverPath, Encoding.UTF8).ReadToEnd();
            return File.ReadAllText(serverPath);
        }
        /// <summary>
        /// 逐行读取txt内容
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns></returns>
        public static List<string> ReadLineTxt(string filePath)
        {
            string serverPath = GetServerPath(filePath);
            var file = File.Open(serverPath, FileMode.Open);
            List<string> list = new List<string>();
            using (var stream = new StreamReader(file))
            {
                string str = "";
                while (!stream.EndOfStream)
                {
                    str = stream.ReadLine();
                    if (str.Length > 0)
                    {
                        list.Add(str.ToLower());
                    }
                }
            }
            return list;
        }
        /// <summary>
        /// 写入txt文件（StreamWriter）
        /// </summary>
        /// <param name="filePath">路径</param>
        /// <param name="content">值</param>
        public static void WriteTxt(string filePath, string content)
        {
            string serverPath = GetServerPath(filePath);
            StreamWriter sw = new StreamWriter(serverPath);
            sw.WriteLine(content);
            sw.Close();
        }
        #endregion

        #region Json
        /// <summary>
        /// 生成json文件
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="content"></param>
        public static void GenerateJsonFile(string filePath, string content)
        {
            string serverPath = GetServerPath(filePath);
            File.AppendAllText(filePath, content);
        }
        #endregion

    }
}
