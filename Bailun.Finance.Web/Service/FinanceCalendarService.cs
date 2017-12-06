using Bailun.Common.Helper;
using Bailun.Finance.Model;
using Bailun.Finance.Model.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Web.Service
{
    /// <summary>
    /// 财经日历服务
    /// </summary>
    public class FinanceCalendarService
    {
        #region 单例

        private volatile static FinanceCalendarService _instance = null;
        private static readonly object lockHelper = new object();
        private FinanceCalendarService()
        { }

        public static FinanceCalendarService CreateInstance()
        {
            if (_instance == null)
            {
                lock (lockHelper)
                {
                    if (_instance == null)
                        _instance = new FinanceCalendarService();
                }
            }
            return _instance;
        }

        #endregion

        static readonly string apiFinanceCalendar = "FinanceCalendarApi";

        #region API

        /// <summary>
        /// 获取指定条件财经日历信息
        /// </summary>
        ///  <param name="website">网站类别</param>
        /// <param name="countrys">国家（多个按“,”分隔）</param>
        /// <param name="releaseState">发布状态</param>
        /// <param name="importance">重要度</param>
        /// <param name="releasedDate">发布时间</param>
        /// <returns></returns>
        public ReturnModel GetCalendarList(string countrys, ReleaseStateDefine releaseState, ImportanceDefine importance, long releasedDate, short website = 1)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("website", website);
                parms.Add("countrys", countrys);
                parms.Add("releaseState", releaseState);
                parms.Add("importance", importance);
                parms.Add("releasedDate", releasedDate);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBailunNews, apiFinanceCalendar, "GetCalendarList"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取最新指定条数财经经济集合
        /// </summary>
        /// <param name="topSize">获取条数</param>
        /// <returns></returns>
        public ReturnModel GetFinanceEconomicsNew(int topSize, short website = 1)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("website", website);
                parms.Add("topSize", topSize);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBailunNews, apiFinanceCalendar, "GetCalendarByTopSize"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = "[{\"Id\":25670,\"SourceId\":\"231295\",\"UnscrambleId\":\"56\",\"DateName\":\"2017年至5月12日\",\"Title\":\"美国至5月12日当周API原油库存(万桶)\",\"Website\":1,\"Country\":\"美国\",\"CountryImg\":\"america.png\",\"Revised\":\"1\",\"Previous\":\"-578.9\",\"Consensus\":\"-228.3\",\"Actual\":\"88.2\",\"Level\":3,\"Star\":3,\"Impact\":4,\"AddDate\":1494950400000,\"ReleasedDate\":1494966786000,\"Status\":2},{\"Id\":25671,\"SourceId\":\"231296\",\"UnscrambleId\":\"57\",\"DateName\":\"2017年至5月12日\",\"Title\":\"美国至5月12日当周API汽油库存(万桶)\",\"Website\":1,\"Country\":\"美国\",\"CountryImg\":\"america.png\",\"Revised\":\"---\",\"Previous\":\"316.9\",\"Consensus\":\"-86.4\",\"Actual\":\"-178\",\"Level\":1,\"Star\":1,\"Impact\":3,\"AddDate\":1494950400000,\"ReleasedDate\":1494966833000,\"Status\":2},{\"Id\":25673,\"SourceId\":\"231298\",\"UnscrambleId\":\"1130\",\"DateName\":\"2017年至5月12日\",\"Title\":\"美国至5月12日当周API库欣原油库存(万桶)\",\"Website\":1,\"Country\":\"美国\",\"CountryImg\":\"america.png\",\"Revised\":\"---\",\"Previous\":\"-13.3\",\"Consensus\":\"-13.3\",\"Actual\":\"-53.9\",\"Level\":1,\"Star\":2,\"Impact\":3,\"AddDate\":1494950400000,\"ReleasedDate\":1494966845000,\"Status\":2},{\"Id\":25672,\"SourceId\":\"231297\",\"UnscrambleId\":\"58\",\"DateName\":\"2017年至5月12日\",\"Title\":\"美国至5月12日当周API精炼油库存(万桶)\",\"Website\":1,\"Country\":\"美国\",\"CountryImg\":\"america.png\",\"Revised\":\"---\",\"Previous\":\"-117.4\",\"Consensus\":\"-125\",\"Actual\":\"178.7\",\"Level\":1,\"Star\":1,\"Impact\":4,\"AddDate\":1494950400000,\"ReleasedDate\":1494966858000,\"Status\":2}]";
            }
            return rm;
        }

        /// <summary>
        /// 获取指定ID财经经济解读详情
        /// </summary>
        /// <param name="economicsId">财经经济ID</param>
        /// <param name="unscrambleId">解读ID</param>
        /// <param name="website">网站类型</param>
        /// <param name="releaseDate">发布时间</param>
        /// <returns></returns>
        public ReturnModel GetEconomicsUnscramble(int sourceId, long releaseDate, string unscrambleId, short website = 1)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("sourceId", sourceId);
                parms.Add("releaseDate", releaseDate);
                parms.Add("unscrambleId", unscrambleId);
                parms.Add("website", website);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBailunNews, apiFinanceCalendar, "GetUnscrambleById"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取指定ID财经经济统计信息
        /// </summary>
        /// <param name="website">网站类别</param>
        /// <param name="unscrambleId">解读ID</param>
        /// <returns></returns>
        public ReturnModel GetEconomicsChart(short website, long startDate, long endDate, string unscrambleId)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("website", website);
                parms.Add("startDate", startDate);
                parms.Add("endDate", endDate);
                parms.Add("unscrambleId", unscrambleId);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiBailunNews, apiFinanceCalendar, "GetEconomicsById"), parms);
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
