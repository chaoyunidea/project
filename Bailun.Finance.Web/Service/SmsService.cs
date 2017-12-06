using Bailun.Common.Extensions;
using Bailun.Common.Helper;
using Bailun.Finance.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bailun.Finance.Web.Service
{
    /// <summary>
    /// 短信验证码
    /// </summary>
    public class SmsService
    {
        #region 单例
        private volatile static SmsService _instance = null;
        private static readonly object lockHelper = new object();
        private SmsService()
        {
        }

        public static SmsService CreateInstance()
        {
            if (_instance == null)
            {
                lock (lockHelper)
                {
                    if (_instance == null)
                        _instance = new SmsService();
                }
            }
            return _instance;
        }
        #endregion

        static string apiSmsController = "Sms";

        #region 
        /// <summary>
        /// 发送手机短信验证码
        /// </summary>
        /// <param name="clientType">客户端(汇信 = 1,外汇110 = 2,论坛 = 3)</param>
        /// <param name="sendType">发送类型：注册 = 1,修改密码 = 2,更换手机号码 = 3,更换邮箱 = 4,绑定邮箱 = 5,绑定手机 = 6,验证短信 = 7,拜仑财经邀请码 = 9,拜仑财经验证码 = 10,拜仑财经邀请 = 11</param>
        /// <param name="phone"></param>
        /// <returns></returns>
        public ReturnModel SendSmsVcode(short clientType, short sendType, string phone)
        {
            var rm = new ReturnModel();
            try
            {
                //api/sms/sendCode 
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("clientType", clientType);
                parms.Add("sendType", sendType);
                parms.Add("telephone", phone);
                rm = HttpRequestHelper.PostRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBaseService, apiSmsController, "sendCode"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }
        /// <summary>
        /// 验证手机短信验证码
        /// </summary>
        /// <param name="sendType">发送类型</param>
        /// <param name="phone">手机号</param>
        /// <param name="code">短信验证码</param>
        /// <returns></returns>
        public ReturnModel CheckSmsVcode(short sendType, string phone, string code)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("sendType", sendType);
                parms.Add("telephone", phone);
                parms.Add("code", code);
                rm = HttpRequestHelper.PostRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBaseService, apiSmsController, "validateCode"), parms);
                if (rm.code != "0" || (rm.code == "0" && rm.subCode != "32100"))
                {
                    LogsHelper.WriteCustomLog("sms", string.Format("SmsServiceHelper CheckSmsVcode，【sendType：{0}，phone：{1}，code：{2}】，【rmCode：{3}，rmSubCode：{4}】,{5},{6}", sendType, phone, code, rm.code, rm.subCode, CustomConfig.ApiBaseService.ConvertEmptyString(), rm.message),rm.bodyMessage.ConvertEmptyString());
                }
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
                LogsHelper.WriteCustomLog("sms", string.Format("SmsServiceHelper CheckSmsVcode Exception，【sendType：{0}，phone：{1}，code：{2}】，{3}", sendType, phone, code, ex.Message), ex.ToString());
            }
            return rm;
        }
        /// <summary>
        /// 清除短信验证码
        /// </summary>
        /// <param name="sendType">发送类型</param>
        /// <param name="phone">手机号</param>
        /// <returns></returns>
        public ReturnModel ClearSmsVcode(short sendType, string phone)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("sendType", sendType);
                parms.Add("telephone", phone);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBaseService, apiSmsController, "ClearSMSRecord"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }
        #endregion
    }
}