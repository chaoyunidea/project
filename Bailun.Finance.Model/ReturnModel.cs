using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model
{
    /// <summary>
    /// Api请求返回模型
    /// </summary>
    public class ReturnModel
    {
        /// <summary>
        /// 返回状态码
        /// </summary>
        public string code { get; set; } = "-1";
        /// <summary>
        /// 返回状态码
        /// </summary>
        public string subCode { get; set; } = "";
        /// <summary>
        /// 提示消息
        /// </summary>
        public string message { get; set; } = "exception_bl";
        /// <summary>
        /// 返回json对象或者返回json字符串
        /// </summary>
        public object bodyMessage { get; set; } = "";

        public int PageIndex { get; set; } = 1;

        public int PageSize { get; set; } = 20;

        public int Total { get; set; } = 1;
    }

 
}
