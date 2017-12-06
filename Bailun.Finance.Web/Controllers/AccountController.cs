using Bailun.Finance.Model;
using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Bailun.Common.Helper;
using System.Collections.Generic;
using Bailun.Finance.Web.Service;

namespace Bailun.Finance.Web.Controllers
{
    public class AccountController : Controller
    {
        static string[] arrInvitationCode = null;
        static readonly object lockInvitationCode = new object();
        public ActionResult ViewPage1()
        {
            return View();
        }
        /// <summary>
        /// 检查邀请码
        /// </summary>
        /// <param name="invitationCode"></param>
        /// <returns></returns>
        ///
        //邀请码页面
        public ActionResult InvitationCode()
        {
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult InvitationCodeVer(string mobile, string icode, string vcode)
        {
            var model = RegisterService.CreateInstance().GetRegisterByRegTypeMobile(22, mobile);
            if (model != null && model.Position == icode)
            {
                var rm = SmsService.CreateInstance().CheckSmsVcode(10, mobile, vcode);

                if (rm.code == "0" && rm.subCode == "32100")
                {
                    CookieService.SetOpenBetaCookie(icode);
                    try
                    {
                        SmsService.CreateInstance().ClearSmsVcode(10, mobile);
                    }
                    catch { }
                    
                    return Redirect(CustomConfig.WebBailunNews);
                }
                return Redirect("/account/invitationcode?s=1");
            }
            return Redirect("/account/invitationcode?s=0");
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="invitationCode"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult CheckInvitationCode(string invitationCode)
        {
            var rm = new ReturnModel();

            try
            {
                SetInvitationCode();

                if (arrInvitationCode.Contains(invitationCode))
                {
                    //string cookieName = "BailunInvitationCode";
                    string cookieName = "userName";
                    CookieHelper.SetCookie(cookieName, DateTime.Now.ToString(), "M", 3, false, "bailun.com");
                    rm.code = "0";
                    rm.message = "邀请码验证成功";
                }
                else
                {
                    rm.message = "邀请码错误";
                }
            }
            catch (Exception ex)
            {
                rm.message = "邀请码验证失败";
                rm.bodyMessage = ex.Message;
            }
            return Json(rm);
        }

        /// <summary>
        /// 
        /// </summary>
        void SetInvitationCode()
        {
            if (arrInvitationCode == null)
            {
                lock (lockInvitationCode)
                {
                    if (arrInvitationCode == null)
                    {
                        arrInvitationCode = new string[] { "QIUYI", "CHENYAO" };
                        //arrInvitationCode = FileHelper.ReadTxt("/Data/Txt/BailunTestInvitationCode_201711021150.txt").ToArray();
                    }
                }
            }
        }
    }
}