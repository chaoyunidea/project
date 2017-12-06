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
    /// 财经快讯服务
    /// </summary>
    public class FinanceNewsService
    {
        #region 单例

        private volatile static FinanceNewsService _instance = null;
        private static readonly object lockHelper = new object();
        private FinanceNewsService()
        { }

        public static FinanceNewsService CreateInstance()
        {
            if (_instance == null)
            {
                lock(lockHelper)
                {
                    if (_instance == null)
                        _instance = new FinanceNewsService();
                }
            }
            return _instance;
        }

        #endregion

        static readonly string apiFinanceNews = "FinanceNewsApi";
        static readonly string apiQuoteQueryImportant = "QuoteQueryImportant";

        #region API

        /// <summary>
        /// 获取(当前传入时间节点)最新指定条数财经快讯
        /// </summary>
        /// <param name="website">来源网站（枚举:（1：金十；2：华尔街；3：fx168；4：fx678；5：DailyFx;））</param>
        /// <param name="isAfter">是否加载当前时间之后的true表示加载,false表示加载当前之间节点之前的</param>
        /// <param name="currentTime">当前日期（13位时间戳）</param>
        /// <param name="topSize">返回记录数</param>
        /// <returns></returns>
        public ReturnModel GetFinanceBrief(short website, bool isAfter, long currentTime, int topSize)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("comeWebsite", website);
                parms.Add("isAfter", isAfter);
                parms.Add("currentTime", currentTime);
                parms.Add("topSize", topSize);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBailunNews, apiFinanceNews, "GetNewBriefByTime"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取所有站点最新指定条数财经快讯
        /// </summary>
        /// <param name="topSize">单一网站获取条数</param>
        /// <returns></returns>
        public ReturnModel GetFinanceAllBrief(int topSize)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("topSize", topSize);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBailunNews, apiFinanceNews, "GetNewBriefByTopSize"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取指定时间之后财经快讯
        /// </summary>
        /// <param name="currentTime">13位时间戳</param>
        /// <returns></returns>
        public ReturnModel GetFinanceBriefByTime(long currentTime)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("currentTime", currentTime);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBailunNews, apiFinanceNews, "GetBriefByTimeBack"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 首页(市场快讯)顶部的重要品种信息
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public ReturnModel GetQuoteQueryImportant(int pageindex,int pagesize)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("pageindex", pageindex);
                parms.Add("pagesize", pagesize);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteQueryImportant, "Query_MainPagePush"), parms);
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
