using Bailun.Common.Helper;
using Bailun.Finance.Model.Calendar;
using Bailun.Finance.Model.Enums;
using Bailun.Finance.Web.Service;
using Bailun.Finance.Web.Service.Helper;
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
    public class CalendarController : Controller
    {  
        /// <summary>
        /// 财经日历
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 财经日历2
        /// </summary>
        /// <returns></returns>
        public ActionResult Index2()
        {
            //var rm = FinanceCalendarService.CreateInstance().GetCalendarList(countrys, releaseState, importance, releasedDate, website);

            return View();
        }

        public ActionResult Detail(int sourceId, int unscrambleId,long date)
        {
            /*获取指定ID财经经济解读详情*/
            var rm = FinanceCalendarService.CreateInstance().GetEconomicsUnscramble(sourceId, date, Convert.ToString(unscrambleId), 1);
            var model = ModelHelper<FinanceUnscrambleModel>.DeserializeObject(rm.code, rm.bodyMessage);

            ViewBag.UnId = unscrambleId;
            ViewBag.Title = model != null ? model.Title : "";
            return View(model);
        }

        /// <summary>
        /// 获取指定条件财经日历信息
        /// </summary>
        /// <param name="website">网站类别:默认金十</param>
        /// <param name="countrys">国家（多个按“,”分隔）</param>
        /// <param name="releaseState">发布状态</param>
        /// <param name="importance">重要度</param>
        /// <param name="releasedDate">发布时间</param>
        /// <returns></returns>
        public JsonResult GetCalendarList(string countrys, ReleaseStateDefine releaseState, ImportanceDefine importance, long releasedDate, short website = 1)
        {
            var rm = FinanceCalendarService.CreateInstance().GetCalendarList(countrys, releaseState, importance, releasedDate, website);
            return Json(rm);
        }

        /// <summary>
        /// 获取最新指定条数财经经济集合
        /// </summary>
        /// <param name="topSize">获取条数</param>
        /// <param name="website">网站类别:默认金十</param>
        /// <returns></returns>
        public JsonResult GetFinanceEconomicsNew(int topSize, short website = 1)
        {
            var rm = FinanceCalendarService.CreateInstance().GetFinanceEconomicsNew(topSize, website);
            return Json(rm);
        }

        /// <summary>
        /// 获取指定ID财经经济解读详情
        /// </summary>
        /// <param name="economicsId">财经经济ID</param>
        /// <param name="unscrambleId">解读ID</param>
        /// <param name="website">网站类别:默认金十</param>
        /// <param name="releaseDate">发布时间</param>
        /// <returns></returns>
        public JsonResult GetEconomicsUnscramble(int economicsId, long releaseDate, string unscrambleId, short website = 1)
        {
            var rm = FinanceCalendarService.CreateInstance().GetEconomicsUnscramble(economicsId, releaseDate, unscrambleId, website);
            return Json(rm);
        }

        /// <summary>
        /// 获取指定ID财经经济统计信息
        /// </summary>
        /// <param name="website">网站类别:默认金十</param>
        /// <param name="unscrambleId">解读ID</param>
        /// <returns></returns>
        public JsonResult GetEconomicsChart( string unscrambleId,long startDate = 0, long endDate = 0, short website = 1)
        {
            var rm = FinanceCalendarService.CreateInstance().GetEconomicsChart(website, startDate, endDate, unscrambleId);
            return Json(rm);
        }

        #region 生成财经日历首页
        /// <summary>
        /// 生成财经日历首页
        /// </summary>
        public ActionResult GenerateStaticPageCalendarIndex()
        {
            if (CustomConfig.WebSiteNo == "2")
            {
                string strMessage = string.Empty;
                string strStaticPageRelativePath = "\\index_kxrlbjsjkqd.html";
                string strStaticPageAbsolutePath = AppDomain.CurrentDomain.BaseDirectory + strStaticPageRelativePath;
                bool result = StaticPageHelper.GenerateStaticPage(strStaticPageAbsolutePath, ControllerContext, "Index", null, null, out strMessage);
                return Content("生成财经日历首页" + DateTime.Now.ToString() + "-----" + strMessage);
            }
            return Content("生成失败，站点验证失败");          
        }
        #endregion
    }
}