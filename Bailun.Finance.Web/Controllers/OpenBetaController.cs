using Bailun.Common.Helper;
using Bailun.Finance.Model;
using Bailun.Finance.Web.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bailun.Finance.Web.Controllers
{
    /// <summary>
    /// 拜仑公测
    /// </summary>
    public class OpenBetaController : Controller
    {
        public ActionResult SetInvitationCodeCookie(string code)
        {
            if(code=="BAILUN")
            {
                CookieService.SetOpenBetaCookie(code);
                return Redirect("/");
            }
            return Redirect("/account/invitationcode");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="smsCode"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult CheckInvitationCode(string invitationCode)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("invitationCode", invitationCode);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMaster, "BailunBetaApi", "CheckInvitationCodeSendSms"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }

            return Json(rm);
        }
        /// <summary>
        /// 验证短信验证码
        /// </summary>
        /// <param name="mobile"></param>
        /// <param name="smsCode"></param>
        /// <param name="invitationCode"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult CheckSmsCode(string mobile, string smsCode, string invitationCode)
        {
            var rm = new ReturnModel();
            if (!string.IsNullOrEmpty(mobile))
            {
                rm = SmsService.CreateInstance().CheckSmsVcode(10, mobile, smsCode);

                if (rm.code == "0" && rm.subCode == "32100")
                {
                    CookieService.SetOpenBetaCookie(invitationCode);
                }
                

                //if (mobile == "18800008888" && smsCode == "1234")
                //{
                //    CookieService.SetOpenBetaCookie(invitationCode);
                //    rm.code = "0";
                //    rm.message = "验证成功";
                //}
                //else
                //{
                //    rm.code = "0";
                //    rm.message = "验证失败";
                //}
            }
            return Json(rm);
        }
    }
}