using Bailun.Common.Helper;
using Bailun.Finance.Model;
using Bailun.Finance.Model.Share;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bailun.Finance.Web.Service
{
    /// <summary>
    /// 通用报名申请
    /// </summary>
    public class RegisterService
    {
        private volatile static RegisterService _instance = null;
        private static readonly object lockHelper = new object();
        private RegisterService()
        {
        }
        public static RegisterService CreateInstance()
        {
            if (_instance == null)
            {
                lock (lockHelper)
                {
                    if (_instance == null)
                        _instance = new RegisterService();
                }
            }
            return _instance;
        }

        private static readonly string apiRegisterInfo = "RegisterInfoApi";
        /// <summary>
        /// 获取报名信息
        /// </summary>
        /// <param name="regType"></param>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public ReturnModel GetRegisterByRegTypeMobileRm(int regType, string mobile)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("regType", regType);
                parms.Add("mobile", mobile);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMaster, apiRegisterInfo, "GetRegisterByRegTypeMobile"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }
        /// <summary>
        /// 获取报名信息
        /// </summary>
        /// <param name="regType"></param>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public RegisterModel GetRegisterByRegTypeMobile(int regType, string mobile)
        {
            var rm = GetRegisterByRegTypeMobileRm(regType, mobile);
            return ModelHelper<RegisterModel>.DeserializeObject(rm.code, rm.bodyMessage);
        }
    }
}