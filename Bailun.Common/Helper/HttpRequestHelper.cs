using FX110.ClientSecurity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Common.Helper
{
    /// <summary>
    /// Http请求帮助类
    /// </summary>
    public static class HttpRequestHelper
    {
        private static readonly string clientType = ConfigHelper.GetWebConfigKey("clientType");

        /// <summary>
        /// 
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        static string GetResponseContent(WebResponse response)
        {
            if (response != null)
            {
                var contentEncoding = response.Headers["Content-Encoding"] != null ? response.Headers["Content-Encoding"] : "";
                var responseStream = response.GetResponseStream();
                switch (contentEncoding)
                {
                    case "gzip":
                        System.IO.Compression.GZipStream gzipstream = new System.IO.Compression.GZipStream(responseStream, System.IO.Compression.CompressionMode.Decompress);
                        StreamReader gzipreader = new StreamReader(gzipstream);
                        return gzipreader.ReadToEnd();
                    case "deflate":
                        System.IO.Compression.DeflateStream deflatestream = new System.IO.Compression.DeflateStream(responseStream, System.IO.Compression.CompressionMode.Decompress);
                        StreamReader deflatereader = new StreamReader(deflatestream);
                        return deflatereader.ReadToEnd();
                    default:
                        StreamReader reader = new StreamReader(responseStream);
                        return reader.ReadToEnd();
                }
            }
            return null;
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="uri">uri请求对象地址</param>
        /// <param name="parms">uri请求参数</param>
        /// <returns></returns>
        public static string GetRequest(string uri = "", Dictionary<string, object> dicParms = null)
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "GET";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/x-www-form-urlencoded;charset=utf-8";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            using (var response = request.GetResponse())
            {
                var responseStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(responseStream);
                return reader.ReadToEnd();
            }
        }
        /// <summary>
        /// GET请求
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="uri">uri请求对象地址</param>
        /// <param name="parms">uri请求参数</param>
        /// <returns></returns>
        public static T GetRequest<T>(string uri = "", Dictionary<string, object> dicParms = null) where T : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "GET";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            using (var response = request.GetResponse())
            {
                string responseStr = GetResponseContent(response);
                return JsonConvert.DeserializeObject<T>(responseStr);
            }
        }

        /// <summary>
        /// GET请求
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="uri">uri请求对象地址</param>
        /// <param name="parms">uri请求参数</param>
        /// <returns></returns>
        public static string GetChartRequest(string uri = "", Dictionary<string, object> dicParms = null)
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "GET";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            using (var response = request.GetResponse())
            {
                string responseStr = GetResponseContent(response);
                return responseStr;
            }
        }
        /// <summary>
        /// GET请求
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="uri">uri请求对象地址</param>
        /// <param name="parms">uri请求参数</param>
        /// <returns></returns>
        public static T GetRequestNoZIP<T>(string uri = "", Dictionary<string, object> dicParms = null) where T : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "GET";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            using (var response = request.GetResponse())
            {
                var responseStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(responseStream);
                string responseStr = reader.ReadToEnd();
                return JsonConvert.DeserializeObject<T>(responseStr);
            }
        }
        /// <summary>
        /// GET请求
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="uri">uri请求对象地址</param>
        /// <param 
        /// name="parms">uri请求参数</param>
        /// <returns></returns>
        public static T GetRequestByObject<T>(string uri = "", Dictionary<string, object> dicParms = null) where T : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "GET";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            using (var response = request.GetResponse())
            {
                string responseStr = GetResponseContent(response);
                return JsonConvert.DeserializeObject<T>(responseStr);
            }

        }

        ///// <summary>
        ///// GET请求
        ///// </summary>
        ///// <typeparam name="T">泛型对象</typeparam>
        ///// <param name="uri">uri请求对象地址</param>
        ///// <param name="parms">uri请求参数</param>
        ///// <returns></returns>
        //public static string GetRequest(string uri = "", Dictionary<string, string> dicParms = null)
        //{
        //    if (dicParms != null)
        //    {
        //        if (!uri.EndsWith("?"))
        //            uri = uri + "?";
        //        foreach (KeyValuePair<string, string> k in dicParms)
        //        {
        //            uri += string.Format("{0}={1}&", k.Key, k.Value);
        //        }
        //        uri = uri.TrimEnd('&');
        //    }
        //    WebRequest request = WebRequest.Create(uri);
        //    request.Method = "GET";
        //    request.Timeout = 30000;
        //    request.ContentType = "application/json";
        //    using (var response = request.GetResponse())
        //    {
        //        var responseStream = response.GetResponseStream();
        //        StreamReader reader = new StreamReader(responseStream);
        //        string responseStr = reader.ReadToEnd();
        //        return responseStr;
        //    }
        //}

        /// <summary>
        /// POST请求
        /// </summary>
        /// <typeparam name="T">获得响应类型</typeparam>
        /// <typeparam name="TPostModel">请求对象,WEBAPI中只有[FromBody]对象类型</typeparam>
        /// <param name="uri">请求的URL地址</param>
        /// <param name="t">请求对象,WEBAPI中只有[FromBody]对象类型</param>
        /// <param name="parms">请求的URL参数</param>
        /// <returns></returns>
        public static T PostRequest<T, TPostModel>(string uri, TPostModel t, Dictionary<string, object> dicParms = null)
            where T : class, new()
            where TPostModel : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "POST";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            var stream = request.GetRequestStream();
            string json = JsonConvert.SerializeObject(t);
            byte[] bytes = Encoding.UTF8.GetBytes(json);
            stream.Write(bytes, 0, bytes.Length);
            using (var response = request.GetResponse())
            {
                string responseStr = GetResponseContent(response);
                return JsonConvert.DeserializeObject<T>(responseStr);
            }
        }

        /// <summary>
        /// POST请求(未压缩)
        /// </summary>
        /// <typeparam name="T">获得响应类型</typeparam>
        /// <typeparam name="TPostModel">请求对象,WEBAPI中只有[FromBody]对象类型</typeparam>
        /// <param name="uri">请求的URL地址</param>
        /// <param name="t">请求对象,WEBAPI中只有[FromBody]对象类型</param>
        /// <param name="parms">请求的URL参数</param>
        /// <returns></returns>
        public static T PostNoZipRequest<T, TPostModel>(string uri, TPostModel t, Dictionary<string, object> dicParms = null)
            where T : class, new()
            where TPostModel : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "POST";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            var stream = request.GetRequestStream();
            string json = JsonConvert.SerializeObject(t);
            byte[] bytes = Encoding.UTF8.GetBytes(json);
            stream.Write(bytes, 0, bytes.Length);
            using (var response = request.GetResponse())
            {
                var responseStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(responseStream);
                string responseStr = reader.ReadToEnd();
                return JsonConvert.DeserializeObject<T>(responseStr);
            }
        }

        /// <summary>
        /// POST扩展请求(可Post数组)
        /// </summary>
        /// <typeparam name="T">获得响应类型</typeparam>
        /// <typeparam name="TPostModel">请求对象,WEBAPI中只有[FromBody]对象类型</typeparam>
        /// <param name="uri">请求的URL地址</param>
        /// <param name="t">请求对象,WEBAPI中只有[FromBody]对象类型</param>
        /// <param name="parms">请求的URL参数</param>
        /// <returns></returns>
        public static T PostExtendRequest
            <T, TPostModel>(string uri, TPostModel t, Dictionary<string, object> dicParms = null)
            where T : class, new()
            where TPostModel : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            //WebRequest request = WebRequest.Create(uri);
            //request.Method = "POST";
            //request.Timeout = 30000;
            //request.ContentType = "application/json";
            //request.Proxy = null;
            var _handler = new HttpClientHandler()
            {
                AutomaticDecompression = DecompressionMethods.GZip
            };
            var _httpClient = new HttpClient(_handler);
            var content = new StringContent(JsonConvert.SerializeObject(t));
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            content.Headers.Add("clientType", GetClientString());
            content.Headers.Add("security", ClientTokenModule.GetToken());
            var resMsg = _httpClient.PostAsync(uri, content);
            var result = resMsg.Result.Content.ReadAsStringAsync();
            resMsg.Dispose();
            var entity = new T();
            if (result != null)
            {
                entity = JsonConvert.DeserializeObject<T>(result.Result);
            }
            return entity;
            //var stream = request.GetRequestStream();
            //string json = Newtonsoft.Json.JsonConvert.SerializeObject(t);
            //byte[] bytes = Encoding.UTF8.GetBytes(json);
            //stream.Write(bytes, 0, bytes.Length);
            //using (var response = request.GetResponse())
            //{
            //    return JsonConvert.DeserializeObject<T>(GetResponseContent(response));
            //}
        }


        public static T PostRequest<T>(string uri, Dictionary<string, object> dicParms)
          where T : class, new()

        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "POST";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            request.GetRequestStream();
            using (var response = request.GetResponse())
            {
                string responseStr = GetResponseContent(response);
                return JsonConvert.DeserializeObject<T>(responseStr);
            }
        }

        /// <summary>
        ///  Put
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="uri"></param>
        /// <param name="dicParms"></param>
        /// <returns></returns>
        public static T PutRequest<T>(string uri, Dictionary<string, object> dicParms = null)
            where T : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "Put";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            request.GetRequestStream();
            using (var response = request.GetResponse())
            {
                string responseStr = GetResponseContent(response);
                return JsonConvert.DeserializeObject<T>(responseStr);
            }
        }
        /// <summary>
        /// POST请求
        /// </summary>
        /// <typeparam name="T">获得响应类型</typeparam>
        /// <typeparam name="TPostModel">请求对象,WEBAPI中只有[FromBody]对象类型</typeparam>
        /// <param name="uri">请求的URL地址</param>
        /// <param name="t">请求对象,WEBAPI中只有[FromBody]对象类型</param>
        /// <param name="parms">请求的URL参数</param>
        /// <returns></returns>
        public static T PutRequest<T, TPostModel>(string uri, TPostModel t, Dictionary<string, object> dicParms = null)
            where T : class, new()
            where TPostModel : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "Put";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            var stream = request.GetRequestStream();
            string json = JsonConvert.SerializeObject(t);
            byte[] bytes = Encoding.UTF8.GetBytes(json);
            stream.Write(bytes, 0, bytes.Length);
            using (var response = request.GetResponse())
            {
                string responseStr = GetResponseContent(response);
                return JsonConvert.DeserializeObject<T>(responseStr);
            }
        }
        /// <summary>
        /// Delete请求
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="uri"></param>
        /// <param name="dicParms"></param>
        /// <returns></returns>
        public static T DeleteRequest<T>(string uri, Dictionary<string, object> dicParms = null)
            where T : class, new()
        {
            if (dicParms != null)
            {
                if (!uri.EndsWith("?"))
                    uri = uri + "?";
                foreach (KeyValuePair<string, object> k in dicParms)
                {
                    uri += string.Format("{0}={1}&", k.Key, k.Value);
                }
                uri = uri.TrimEnd('&');
            }
            WebRequest request = WebRequest.Create(uri);
            request.Method = "DELETE";
            request.Timeout = 30000;
            request.Proxy = null;
            request.ContentType = "application/json";
            request.Headers.Add("clientType", GetClientString());
            request.Headers.Add("security", ClientTokenModule.GetToken());
            request.GetRequestStream();
            using (var response = request.GetResponse())
            {
                string responseStr = GetResponseContent(response);
                return JsonConvert.DeserializeObject<T>(responseStr);
            }
        }
        /// <summary>
        /// request.Headers clientType
        /// </summary>
        /// <returns></returns>
        static string GetClientString()
        {
            return clientType + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + "-" + DateTime.Now.Hour + "-" + DateTime.Now.Minute;
        }
    }
}
