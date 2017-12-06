using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Common.Helper
{
    /// <summary>
    /// 模型转换
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public static class ModelHelper<T> where T : class
    {
        /// <summary>
        /// 反序列化
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static T DeserializeObject(string value)
        {
            try
            {
                return string.IsNullOrEmpty(value) ? null : JsonConvert.DeserializeObject<T>(value);
            }
            catch
            {

            }
            return null;
        }
        /// <summary>
        /// 反序列化
        /// </summary>
        /// <param name="code">ReturnModel 状态码：0 可反序列化</param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static T DeserializeObject(string code, string value)
        {
            try
            {
                return code == "0" && !string.IsNullOrEmpty(value) ? JsonConvert.DeserializeObject<T>(value) : null;
            }
            catch
            {

            }
            return null;
        }
        /// <summary>
        /// 反序列化
        /// </summary>
        /// <param name="code">ReturnModel 状态码：0 可反序列化</param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static T DeserializeObject(string code, object value)
        {
            try
            {
                return code == "0" && value != null ? JsonConvert.DeserializeObject<T>(value.ToString()) : null;
            }
            catch
            {

            }
            return null;
        }
        /// <summary>
        /// 序列化
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string SerializeObject(T obj)
        {
            try
            {
                return obj != null ? JsonConvert.SerializeObject(obj) : string.Empty;
            }
            catch
            {
            }
            return string.Empty;
        }
    }
}
