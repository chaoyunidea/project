using Bailun.Finance.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bailun.Finance.Web.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class SmsCodeController : Controller
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="smsCode"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult CheckSmsCode(string smsCode)
        {
            var rm = new ReturnModel();
            try
            {
                rm.message = "功能开发中。。。";
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return Json(rm);
        }
    }
}