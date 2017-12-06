using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Bailun.Finance.Web.Service;
using Bailun.Common.Helper;
using Bailun.Finance.Model.Indicator;
using Bailun.Finance.Web.Service.Helper;
using Bailun.Finance.Model;

namespace Bailun.Finance.Web.Controllers
{
    public class IndicatorController : Controller
    {
        // GET: Indicator
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 美国经济数据
        /// </summary>
        /// <returns></returns>
        public ActionResult IndexUsDataView()
        {
            int[] arrSymbol = new int[] { 1, 2, 3, 4 };
            Dictionary<int, IList<DataCenterModel>> bannerData = new Dictionary<int, IList<DataCenterModel>>();
            foreach (var symbol in arrSymbol)
            {
                var rm = new ReturnModel();
                IList<DataCenterModel> list;
                rm = FinanceIndicatorService.CreateInstance().GetIndexBannerData(18, 1, symbol, 1, 0);
                list = ModelHelper<IList<DataCenterModel>>.DeserializeObject(rm.code, rm.bodyMessage);
                bannerData.Add(symbol, list != null ? list : new List<DataCenterModel>());
            }

            return View(bannerData);
        }
        /// <summary>
        /// 全球主要国家经济数据
        /// </summary>
        /// <returns></returns>
        public ActionResult IndexGlobalDataView()
        {
            var GModel = FinanceIndicatorService.CreateInstance().GetIndexGlobelIndicator();
            var GId = FinanceIndicatorService.CreateInstance().GetIndexGlobelIndicatorId();
            var GlobalData = ModelHelper<GlobalEconomicModel>.DeserializeObject(GModel.code, GModel.bodyMessage);
            ViewBag.GId = ModelHelper<GlobalEconomicModel>.DeserializeObject(GId.code, GId.bodyMessage);
            return View(GlobalData);
        }
        // GET: Indicator
        public ActionResult DataCenter(string id)
        {
            var idArr = id.Split('-');
            ViewBag.Country = (idArr.Length > 1) ? int.Parse(idArr[1]) : 1;
            var rm = FinanceIndicatorService.CreateInstance().GetIndexBannerData(50, 1, int.Parse(idArr[0]), ViewBag.Country, 0);
            var model = ModelHelper<List<DataCenterModel>>.DeserializeObject(rm.code, rm.bodyMessage);
            ViewBag.Id = int.Parse(idArr[0]);

            return View(model);
        }

        // GET: Indicator
        public ActionResult Country(int id)
        {
            var countryData = FinanceIndicatorService.CreateInstance().GetCountryGroup();
            ViewBag.CountryModel = ModelHelper<List<CountryDetailModel>>.DeserializeObject(countryData.code, countryData.bodyMessage);
            ViewBag.Id = id;
            return View();
        }

        // GET: Detail
        public ActionResult Detail(string id)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetEcoItemDetails(id);
            var model = (ModelHelper<List<IndicatorDetailModel>>.DeserializeObject(rm.code, rm.bodyMessage))[0];
            var menuData = FinanceIndicatorService.CreateInstance().GetIndicatorSubitem(model.Country);
            var indicatorData = FinanceIndicatorService.CreateInstance().GetIndicaByCountryId(model.Country);
            var countryData = FinanceIndicatorService.CreateInstance().GetCountryGroup();
            ViewBag.Id = id;
            ViewBag.MenuModel = ModelHelper<List<IndicatorMenuModel>>.DeserializeObject(menuData.code, menuData.bodyMessage);
            ViewBag.CountryModel = ModelHelper<List<CountryDetailModel>>.DeserializeObject(countryData.code, countryData.bodyMessage);
            ViewBag.IndicatorModel = ModelHelper<List<ItemSubModel>>.DeserializeObject(indicatorData.code, indicatorData.bodyMessage);
            return View(model);
        }

        //获取宏观数据首页banner数据
        [HttpPost]
        public JsonResult IndexBannerData(int pageSize, int pageIndex, int ctype, int countryId = 1, int valueTime = 0)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetIndexBannerData(pageSize, pageIndex, ctype, countryId, valueTime);
            return Json(rm);
        }


        //获取首页各国经济数据
        [HttpPost]
        public JsonResult IndexGlobelIndicator()
        {
            var rm = FinanceIndicatorService.CreateInstance().GetIndexGlobelIndicator();
            return Json(rm);
        }

        //获取首页各国经济数据ID
        [HttpPost]
        public JsonResult IndexGlobelIndicatorId(/*int pagesize, int pageIndex*/)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetIndexGlobelIndicatorId(/*pagesize, pageIndex*/);
            return Json(rm);
        }

        //获取首页经济数据chart
        [HttpPost]
        public JsonResult IndexGlobelIndicatorChart(int country, int type, int sp)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetIndexGlobelIndicatorChart(country, type, sp);
            return Json(rm);
        }

        //根据ID获取经济指标详情数据
        [HttpPost]
        public JsonResult RequestEcoItemDetails(string mainItemId)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetEcoItemDetails(mainItemId);
            return Json(rm);
        }

        //根据ID获取经济指标图表
        [HttpPost]
        public JsonResult EcoItemDetailsChart(string uptxttime, string downtxttime, string mainItemId)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetEcoItemDetailsChart(uptxttime, downtxttime, mainItemId);
            return Json(rm);
        }

        //获取国家对应的经济指标集合
        [HttpPost]
        public JsonResult IndicatorSubitem(int country)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetIndicatorSubitem(country);
            return Json(rm);
        }

        //获取国家对应的经济指标集合(不分大项)
        [HttpPost]
        public JsonResult IndicaByCountryId(int countryId)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetIndicaByCountryId(countryId);
            return Json(rm);
        }

        //获取国家集合
        [HttpPost]
        public JsonResult requestCountryGroup()
        {
            var rm = FinanceIndicatorService.CreateInstance().GetCountryGroup();
            return Json(rm);
        }

        //获取国家对应的指标小项的数据
        [HttpPost]
        public JsonResult requestIndicatorItem(int country, int indicator)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetIndicatorItem(country, indicator);
            return Json(rm);
        }

        //获取国家Banner六条展示数据
        [HttpPost]
        public JsonResult CountryBannerList()
        {
            var rm = FinanceIndicatorService.CreateInstance().GetCountryBannerList();
            return Json(rm);
        }

        //获取国家对比图表数据
        [HttpPost]
        public JsonResult CountryCompareChart(string mcountry, int itemId, string uptxttime, string downtxttime)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetCountryCompareChart(mcountry, itemId, uptxttime, downtxttime);
            return Json(rm);
        }

        //获取金十数据详细介绍
        [HttpPost]
        public JsonResult IntroduceInfo(int rctype, int rcountryId = 1)
        {
            var rm = FinanceIndicatorService.CreateInstance().GetIntroduceInfo(rctype, rcountryId);
            return Json(rm);
        }

        #region 生成宏观数据首页
        /// <summary>
        /// 生成宏观数据首页
        /// </summary>
        public ActionResult GenerateStaticPageIndicatorIndex()
        {
            if (CustomConfig.WebSiteNo == "4")
            {
                string strMessage = string.Empty;
                string path = AppDomain.CurrentDomain.BaseDirectory + "\\index_kxrlbjsjkqd.html"; ;
                StaticPageHelper.GenerateStaticPage(path, ControllerContext, "Index", null, null, out strMessage);
                return Content("生成宏观数据首页" + DateTime.Now.ToString() + "-----" + strMessage);
            }
            return Content("生成失败，站点错误");
        }
        #endregion
    }
}