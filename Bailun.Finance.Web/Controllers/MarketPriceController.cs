using Bailun.Common.Helper;
using Bailun.Finance.Model.Quote;
using Bailun.Finance.Web.Service;
using Bailun.Finance.Web.Service.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bailun.Common.Extensions;

namespace Bailun.Finance.Web.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class MarketPriceController : Controller
    {
        /// <summary>
        /// 市场报价首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 品种视图
        /// </summary>
        /// <returns></returns>
        public ActionResult IndexProductView(string productIds = "1,11,2,3,10,4,9 ")
        {
            int[] arrSymbol = productIds.ConvertToIntArray();
            if (arrSymbol.Length == 0)
                arrSymbol = new int[] { 1, 11, 2, 3, 10, 4, 9 };

            Dictionary<int, IList<ChatIndexModel>> dic = new Dictionary<int, IList<ChatIndexModel>>();
            foreach (int symbol in arrSymbol)
            {
                var list = FinanceQuoteService.CreateInstance().GetMarketPriceProduct(symbol, 1, 8);
                dic.Add(symbol, list != null ? list : new List<ChatIndexModel>());
            }
            return View(dic);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult StockList(string id)
        {
            var idarr = id.Split('-');
            ViewBag.productId = idarr[0];
            //ViewBag.plateType = idarr[1];
            ViewBag.plateId = idarr[1];
            return View();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult PlateList(string id)
        {
            ViewBag.productId = id;
            return View();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Detail(int id)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryMarketDetail(id);
            var model = ModelHelper<QueryDetailModel>.DeserializeObject(rm.code, rm.bodyMessage);

            ViewBag.Id = id;
            ViewBag.Title = model != null ? model.Cn_name : "";
            return View(model);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult StockDetail(int id)
        {
            //var rm = FinanceQuoteService.CreateInstance().GerRealDetailForWeb(id);
            //var model = ModelHelper<QueryTimelyModel>.DeserializeObject(rm.code, rm.bodyMessage.ToString());
            // var idarr = id.Split('-');
            //ViewBag.productId = idarr[0];
            // ViewBag.plateId = idarr[1];
            ViewBag.marketId = id;
            //ViewBag.Title = model != null ? model.Cn_name : "";
            return View();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public ActionResult PriceList(string type)
        {
            ViewBag.Type = type;
            return View();
        }

        /// <summary>
        /// 搜索品种
        /// </summary>
        /// <param name="keyword"></param>
        /// <returns></returns>
        public ActionResult Search(string keyword)
        {
            return View();
        }
        
        /// <summary>
        /// 查询外汇历史报价数据
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetQuoteHistory(int marketdetailsid, string datetime, int leftOrRight, int historytype)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQuoteHistory(marketdetailsid, datetime, leftOrRight, historytype);
            return Json(rm);
        }


        /// <summary>
        /// 获取市场行情数据类型
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetMarketDetail(int marketId)
        {
            var rm = FinanceQuoteService.CreateInstance().GetMarketDetail(marketId);
            return Json(rm);
        }

        /// <summary>
        /// 通过市场ID跳转到详情页面时获取最后一次实时报价数据
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GerRealDetailForWeb(int marketDetailId)
        {
            var rm = FinanceQuoteService.CreateInstance().GerRealDetailForWeb(marketDetailId);
            return Json(rm);
        }

        /// <summary>
        /// 针对拜伦财经的接口推送
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetChatIndexForBailun()
        {
            var rm = FinanceQuoteService.CreateInstance().GetChatIndexForBailun();
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
            var rm = FinanceQuoteService.CreateInstance().GetQuoteQueryImportant(pageindex, pagesize);
            return Json(rm);
        }

        /// <summary>
        /// 首页(市场快讯)顶部的分类品种信息
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult QueryRecommendByProductShowIndex(int product, int pageindex, int pagesize)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryRecommendByProductShowIndex(product, pageindex, pagesize);
            return Json(rm);
        }

        /// <summary>
        /// 市场报价首页重要品种的产品ID列表信息获取
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult QueryRecommendProduct(int pageindex, int pagesize)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryRecommendProduct(pageindex, pagesize);
            return Json(rm);
        }

        /// <summary>
        /// 根据指定的产品ID信息获得下面设置的重要品种信息以及最后一次报价数据
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// /// <param name="product"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult QueryRecommendByProduct(int product, int pageindex, int pagesize)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryRecommendByProduct(product, pageindex, pagesize);
            return Json(rm);
        }
        /// <summary>
        /// 页面查询功能
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// /// <param name="product"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetQueryMarketMethod(int pagesize, int pageindex, string condition)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryMarket(pagesize, pageindex, condition);
            return Json(rm);
        }

        /// <summary>
        /// 根据指定的产品ID信息获得下面设置的重要品种信息以及最后一次报价数据
        /// </summary>
        /// <param name="marketId"></param>       
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetMinutePriceMethod(int marketId)
        {
            var rm = FinanceQuoteService.CreateInstance().GetMinutePrice(marketId);
            return Json(rm);
        }

        /// <summary>
        /// 根据产品ID获得下面的品种列表信息
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// /// <param name="product"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult QueryPlatByProductMethod(int product, int pageindex, int pagesize)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryPlatByProduct(product, pageindex, pagesize);
            return Json(rm);
        }

        /// <summary>
        /// 获得股票分时数据列表(暂时无美股数据)
        /// </summary>
        /// <param name="marketid"></param>    
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetStockDealMethod(int marketid)
        {
            var rm = FinanceQuoteService.CreateInstance().GetStockDeal(marketid);
            return Json(rm);
        }

        /// <summary>
        /// 根据产品获得该产品下面的品种板块有哪些(主要针对的是股票)
        /// </summary>

        /// <param name="product"></param>  
        /// <param name="pagesize"></param>
        /// <param name="pageindex"></param> 
        /// <param name="ClassificationType"></param>  
        /// <returns></returns>
        [HttpPost]
        public JsonResult QueryPlatInfoByProduct(int product, int pagesize, int pageindex, int ClassificationType)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryPlatInfoByProduct(product, pagesize, pageindex, ClassificationType);
            return Json(rm);
        }

        /// <summary>
        /// 查询指定板块下面的品种列表
        /// </summary>
        /// <param name="plate"></param>  
        /// <param name="pagesize"></param>
        /// <param name="pageindex"></param>      
        /// <returns></returns>
        [HttpPost]
        public JsonResult QueryMarketByPlate(int plate, int pagesize, int pageindex)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryMarketByPlate(plate, pagesize, pageindex);
            return Json(rm);
        }

        /// <summary>
        /// 获取品种详情
        /// </summary>
        /// <param name="plateId"></param>      
        /// <returns></returns>
        [HttpPost]
        public JsonResult QueryPlateName(int plateId)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryPlateName(plateId);
            return Json(rm);
        }

        /// <summary>
        /// 获取品种详情
        /// </summary>
        /// <param name="plateId"></param>      
        /// <returns></returns>
        [HttpPost]
        public JsonResult QueryMarketDetail(int marketid)
        {
            var rm = FinanceQuoteService.CreateInstance().GetQueryMarketDetail(marketid);
            return Json(rm);
        }

        #region 生成市场报价首页
        /// <summary>
        /// 生成市场报价首页
        /// </summary>
        public ActionResult GenerateStaticPageMarketPriceIndex()
        {
            if (CustomConfig.WebSiteNo == "3")
            {
                string strMessage = string.Empty;
                string strStaticPageAbsolutePath = AppDomain.CurrentDomain.BaseDirectory + "\\index_kxrlbjsjkqd.html";
                StaticPageHelper.GenerateStaticPage(strStaticPageAbsolutePath, ControllerContext, "Index", null, null, out strMessage);
                return Content("生成市场报价首页" + DateTime.Now.ToString() + "-----" + strMessage);
            }
            return Content("生成失败，站点验证失败");
        }


        /// <summary>
        /// 分时数据获取
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// /// <param name="product"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Historyreconnect(string symbol, int resolution)
        {
            var rm = FinanceQuoteService.CreateInstance().GetHistoryreconnect(symbol, resolution);
            return Json(rm);
        }

        #endregion

    }
}