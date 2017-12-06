using Bailun.Common.Helper;
using Bailun.Finance.Model.News;
using Bailun.Finance.Web.Service;
using Bailun.Finance.Web.Service.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bailun.Finance.Model.Quote;
using Bailun.Finance.Model;

namespace Bailun.Finance.Web.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class NewsController : Controller
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //var rm = FinanceNewsService.CreateInstance().GetFinanceAllBrief(20);
            //var model = ModelHelper<FinanceBriefListModel>.DeserializeObject(rm.code, rm.bodyMessage);
            //return View(model);
            return View();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [ChildActionOnly]
        public ActionResult NewsView()
        {
            var rm = FinanceNewsService.CreateInstance().GetFinanceAllBrief(20);
            var model = ModelHelper<FinanceBriefListModel>.DeserializeObject(rm.code, rm.bodyMessage);
            return View(model);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [ChildActionOnly]
        public ActionResult QuoteView()
        {
            int[] arrSymbol = new int[] { 0, 1, 2, 3, 4, 9, 10, 11 };
            Dictionary<int, IList<ChatIndexModel>> dic = new Dictionary<int, IList<ChatIndexModel>>();
            foreach (int symbol in arrSymbol)
            {
                var rm = new ReturnModel();
                IList<ChatIndexModel> list;
                if (symbol == 0)
                {
                    rm = FinanceQuoteService.CreateInstance().GetQuoteQueryImportant(1, 6);
                    list = ModelHelper<IList<ChatIndexModel>>.DeserializeObject(rm.code, rm.bodyMessage);
                }
                else
                {
                    rm = FinanceQuoteService.CreateInstance().GetQueryRecommendByProductShowIndex(symbol, 1, 6);
                    list = ModelHelper<IList<ChatIndexModel>>.DeserializeObject(rm.code, rm.bodyMessage);
                }


                dic.Add(symbol, list != null ? list : new List<ChatIndexModel>());
            }
            return View(dic);
        }

        /// <summary>
        /// 首次加载数据
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetFirstNew()
        {
            var rm = FinanceNewsService.CreateInstance().GetFinanceAllBrief(20);
            var model = ModelHelper<FinanceBriefListModel>.DeserializeObject(rm.code, rm.bodyMessage);
            return Json(model);

        }

        /// <summary>
        /// 获取（当前传入时间节点）的最新指定条数财经快讯
        /// </summary>
        /// <param name="website">来源网站（枚举:（1：金十；2：华尔街；3：fx168；4：fx678；5：DailyFx;））</param>
        /// <param name="isAfter">是否加载当前时间之后的true表示加载,false表示加载当前之间节点之前的</param>
        /// <param name="currentTime">当前日期（13位时间戳）</param>
        /// <param name="topSize">返回记录数</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetFinanceBrief(short website, bool isAfter, long currentTime, int topSize)
        {
            var rm = FinanceNewsService.CreateInstance().GetFinanceBrief(website, isAfter, currentTime, topSize);
            return Json(rm);
        }

        /// <summary>
        /// 获取所有站点最新指定条数财经快讯
        /// </summary>
        /// <param name="topSize">单一网站获取条数</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetFinanceAllBriefNew(int topSize)
        {
            var rm = FinanceNewsService.CreateInstance().GetFinanceAllBrief(topSize);
            return Json(rm);
        }

        /// <summary>
        /// 获取指定时间之后财经快讯
        /// </summary>
        /// <param name="currentTime">13位时间戳</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetFinanceBriefByTime(long currentTime)
        {
            var rm = FinanceNewsService.CreateInstance().GetFinanceBriefByTime(currentTime);
            return Json(rm);
        }

        /// <summary>
        /// 首页(市场快讯)顶部的重要品种信息
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetQuoteQueryImportant(int pageindex, int pagesize)
        {
            var rm = FinanceNewsService.CreateInstance().GetQuoteQueryImportant(pageindex, pagesize);
            return Json(rm);
        }

        #region 生成静态首页
        /// <summary>
        /// 生成静态首页
        /// </summary>
        public ActionResult GenerateStaticPageNewsIndex()
        {
            string strMessage = string.Empty;
            string strStaticPageRelativePath = "\\index_kxrlbjsjkqd.html";
            string strStaticPageAbsolutePath = AppDomain.CurrentDomain.BaseDirectory + strStaticPageRelativePath;

            bool result = StaticPageHelper.GenerateStaticPage(strStaticPageAbsolutePath, ControllerContext, "Index", null, null, out strMessage);
            return Content("生成新闻静态首页" + DateTime.Now.ToString() + "-----" + strMessage);
        }
        #endregion
    }
}