using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Common.Helper
{
    public class HttpApiHelper
    {
        /// <summary>
        /// api请求组装
        /// </summary>
        /// <param name="api"></param>
        /// <param name="controller"></param>
        /// <returns></returns>
        public static string CreateHttpApiCall(string api, string controller)
        {
            return string.Format("{0}/api/{1}", api, controller);
        }
        /// <summary>
        /// api请求组装
        /// </summary>
        /// <param name="api"></param>
        /// <param name="controller"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static string CreateHttpApiCall(string api, string controller, string method)
        {
            return string.Format("{0}/api/{1}/{2}", api, controller, method);
        }
    }
}
