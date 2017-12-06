using Bailun.Common.Helper;
using Bailun.Finance.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Web.Service
{
    /// <summary>
    /// 财经报价服务
    /// </summary>
    public class FinanceIndicatorService
    {
        #region 单例

        protected volatile static FinanceIndicatorService _instance = null;
        protected static readonly object _lockHelper = new object();

        private FinanceIndicatorService()
        { }

        public static FinanceIndicatorService CreateInstance()
        {
            if (_instance == null)
            {
                lock(_lockHelper)
                {
                    if (_instance == null)
                    {
                        _instance = new FinanceIndicatorService();
                    }
                }
            }

            return _instance;
        }

        #endregion


        static readonly string apiJinTenBlank = "JinTenBlankApi";
        static readonly string apiReportList = "ReportList";
        static readonly string apiWallsSummary = "WallsSummaryApi";
        static readonly string apiIndicatorItems = "indicatorItems";
        static readonly string apiKlineGraph = "klineGraph";
        static readonly string apiGetEcoItemDetails = "GetEcoItemDetails";
        static readonly string apiWallsEcoItemsDetails = "WallsEcoItemsDetailsApi";
        static readonly string apiIndicatorSubitem = "indicatorSubitem";
        static readonly string apiIndicaByCountryId = "indicaByCountryId";
        static readonly string apiWallsCountry = "WallsCountryApi";
        static readonly string apiWallDataRecent = "recentDataSset";
        static readonly string apiNeedIndicatorList = "needIndicatorList";
        static readonly string apiThanMulitple = "ThanMulitple";
        #region API

        /// <summary>
        /// 首页头部banner数据
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <param name="ctype"></param>
        /// <param name="countryId"></param>
        /// /// <param name="valueTime"></param>
        /// <returns></returns>
        public ReturnModel GetIndexBannerData(int pageSize, int pageIndex, int ctype, int countryId,int valueTime)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("pageSize", pageSize);
                parms.Add("pageIndex", pageIndex);
                parms.Add("ctype", ctype);
                parms.Add("countryId", countryId);
                parms.Add("valueTime", valueTime);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiJinTenBlank), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取首页各国经济数据
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <returns></returns>
        public ReturnModel GetIndexGlobelIndicator()
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();                               
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiWallsSummary), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取首页各国经济数据ID
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <returns></returns>
        public ReturnModel GetIndexGlobelIndicatorId(/*int pagesize = 1, int pageIndex = 100*/)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                //parms.Add("pagesize", pagesize);
                //parms.Add("pageIndex", pageIndex);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiIndicatorItems), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取首页各国经济数据chart
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageIndex"></param>
        /// <returns></returns>
        public ReturnModel GetIndexGlobelIndicatorChart(int country, int type,int sp)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("country", country);
                parms.Add("type", type);
                parms.Add("sp", sp);
                rm = HttpRequestHelper.PostRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiKlineGraph), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 根据ID获取经济指标详情数据
        /// </summary>
        /// <param name="mainItemId"></param>       
        /// <returns></returns>
        public ReturnModel GetEcoItemDetails(string mainItemId)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("mainItemId", mainItemId);                
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiGetEcoItemDetails), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 根据ID获取经济指标图表
        /// </summary>
        /// <param name="mainItemId"></param>       
        /// <returns></returns>
        public ReturnModel GetEcoItemDetailsChart(string uptxttime, string downtxttime, string mainItemId)
        {
            var rm = new ReturnModel();
            try        
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("uptxttime", uptxttime);
                parms.Add("downtxttime", downtxttime);                        
                parms.Add("mainItemId", mainItemId);
                              
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiWallsEcoItemsDetails), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取国家对应的经济指标集合
        /// </summary>
        /// <param name="country"></param>       
        /// <returns></returns>
        public ReturnModel GetIndicatorSubitem(int country)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("country", country);              
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiIndicatorSubitem), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取国家对应的经济指标集合(不分大项)
        /// </summary>
        /// <param name="countryId"></param>    
        /// <param name="addpar"></param> 
        /// <returns></returns>
        public ReturnModel GetIndicaByCountryId(int countryId)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("countryId", countryId);               
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiIndicaByCountryId), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取国家对应的指标小项的数据
        /// </summary>
        /// <param name="countryId"></param>    
        /// <param name="addpar"></param> 
        /// <returns></returns>
        public ReturnModel GetIndicatorItem(int country,int indicator)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("country", country);
                parms.Add("indicator", indicator);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiWallDataRecent), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取国家集合
        /// </summary>       
        /// <returns></returns>
        public ReturnModel GetCountryGroup()
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();                
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiWallsCountry), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取国家集合
        /// </summary>       
        /// <returns></returns>
        public ReturnModel GetCountryBannerList()
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiNeedIndicatorList), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取国家比较图表数据
        /// </summary>       
        /// <returns></returns>
        public ReturnModel GetCountryCompareChart(string mcountry, int itemId, string uptxttime, string downtxttime)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("mcountry", mcountry);
                parms.Add("itemId", itemId);
                parms.Add("uptxttime", uptxttime);
                parms.Add("downtxttime", downtxttime);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiThanMulitple), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        ///  //获取金十数据详细介绍
        /// </summary>       
        /// <returns></returns>
        public ReturnModel GetIntroduceInfo(int rctype, int rcountryId)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("rctype", rctype);
                parms.Add("rcountryId", rcountryId);               
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiMacroeData, apiReportList), parms);
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
