using Bailun.Finance.Web.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bailun.Finance.Model.Quote;
using Bailun.Finance.Model;
using Bailun.Common.Helper;

namespace Bailun.Finance.Web.Controllers
{
    public class MarketPriceViewController : Controller
    {
        // GET: MarketPriceView

        
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult Forex()
        {
            var list = FinanceQuoteService.CreateInstance().GetMarketPriceProduct(1, 1, 8);
            return View(list);
        }
        /// <summary>
        /// 贵金属
        /// </summary>
        /// <returns></returns>
        public ActionResult PreciousMetals()
        {
            var list = FinanceQuoteService.CreateInstance().GetMarketPriceProduct(2, 1, 8);
            return View(list);
        }
        /// <summary>
        /// 大宗商品
        /// </summary>
        /// <returns></returns>
        public ActionResult Commodity()
        {
            var list = FinanceQuoteService.CreateInstance().GetMarketPriceProduct(3, 1, 8);
            return View(list);
        }
        /// <summary>
        /// 股指
        /// </summary>
        /// <returns></returns>
        public ActionResult StockIndex()
        {
            var list = FinanceQuoteService.CreateInstance().GetMarketPriceProduct(4, 1, 8);
            return View(list);
        }
        /// <summary>
        /// 期货
        /// </summary>
        /// <returns></returns>
        public ActionResult Futures()
        {
            var list = FinanceQuoteService.CreateInstance().GetMarketPriceProduct(9, 1, 8);
            return View(list);
        }
        /// <summary>
        /// 债券
        /// </summary>
        /// <returns></returns>
        public ActionResult Bonds()
        {
            var list = FinanceQuoteService.CreateInstance().GetMarketPriceProduct(10, 1, 8);
            return View(list);
        }
        /// <summary>
        /// 比特币
        /// </summary>
        /// <returns></returns>
        public ActionResult Bitcoin()
        {
            var list = FinanceQuoteService.CreateInstance().GetMarketPriceProduct(11, 1, 8);
            return View(list);
        }
    }
}