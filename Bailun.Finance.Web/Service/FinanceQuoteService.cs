using Bailun.Common.Helper;
using Bailun.Finance.Model;
using Bailun.Finance.Model.Quote;
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
    public class FinanceQuoteService
    {
        #region 单例

        protected volatile static FinanceQuoteService _instance = null;
        protected static readonly object _lockHelper = new object();

        private FinanceQuoteService()
        { }

        public static FinanceQuoteService CreateInstance()
        {
            if (_instance == null)
            {
                lock (_lockHelper)
                {
                    if (_instance == null)
                    {
                        _instance = new FinanceQuoteService();
                    }
                }
            }

            return _instance;
        }

        #endregion


        static readonly string apiQuoteHistory = "QuoteHistoryApi";
        static readonly string apiQuoteExchange = "QuoteExchangeApi";
        static readonly string apiQueryTimely = "QueryTimelyApi";
        static readonly string apiQuoteSubscriber = "QuoteSubscriberApi";
        static readonly string apiQuoteQueryImportant = "QuoteQueryImportant";
        static readonly string apiQueryQuote = "QueryQuote";
        static readonly string apiQuoteQueryProduct = "QuoteQueryProduct";
        static readonly string apiQueryStockDeal = "QueryStockDeal";
        static readonly string apiQuoteQueryPlate = "QuoteQueryPlate";
        #region API

        /// <summary>
        /// 查询外汇历史报价数据
        /// </summary>
        /// <param name="marketdetailsid"></param>
        /// <param name="datetime">格式:20170101 10:10:10</param>
        /// <param name="leftOrRight">0/1 默认查找历史</param>
        /// <param name="historytype">历史类型</param>
        /// <returns></returns>
        public ReturnModel GetQuoteHistory(int marketdetailsid, string datetime, int leftOrRight, int historytype)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("marketdetailsid", marketdetailsid);
                parms.Add("datetime", datetime);
                parms.Add("leftOrRight", leftOrRight);
                parms.Add("historytype", historytype);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteHistory, "GetForexHistory"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获取市场行情数据类型
        /// </summary>
        /// <param name="marketId">市场中心的ID</param>
        /// <returns></returns>
        public ReturnModel GetMarketDetail(int marketId)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("MarketId", marketId);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteExchange, "GetMarketDetail"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 通过市场ID跳转到详情页面时获取最后一次实时报价数据
        /// </summary>
        /// <param name="marketId">市场中心的详情ID</param>
        /// <returns></returns>
        public ReturnModel GerRealDetailForWeb(int marketDetailId)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("marketDetailId", marketDetailId);

                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQueryTimely, "GerRealDetailForWeb"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 针对拜伦财经的接口推送
        /// </summary>
        /// <param name="marketId">市场中心的详情ID</param>
        /// <returns></returns>
        public ReturnModel GetChatIndexForBailun()
        {
            var rm = new ReturnModel();
            try
            {
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteSubscriber, "GetChatIndexForBailun"), null);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = "[{\"SubscriberId\":100009,\"MarketId\":1,\"Code\":\"EUR.USD\",\"Description\":\"European Monetary Union Euro\",\"Symbol\":\"EUR\",\"Currency\":\"USD\",\"ContractType\":\"CASH\",\"Exchange\":\"IDEALPRO\",\"Cn_Name\":\"欧元/美元\",\"En_Name\":\"EURUSD\",\"ConId\":\"100009\",\"DecimalPoint\":7,\"Ask\":\"1.11103\",\"Bid\":\"1.11099\",\"Pre_Close\":\"1.10830\",\"High\":\"1.11135\",\"Low\":\"1.10800\"},{\"SubscriberId\":100041,\"MarketId\":1,\"Code\":\"GBP.USD\",\"Description\":\"British pound\",\"Symbol\":\"GBP\",\"Currency\":\"USD\",\"ContractType\":\"CASH\",\"Exchange\":\"IDEALPRO\",\"Cn_Name\":\"英镑/美元\",\"En_Name\":\"GBPUSD\",\"ConId\":\"100041\",\"DecimalPoint\":7,\"Ask\":\"1.29195\",\"Bid\":\"1.29191\",\"Pre_Close\":\"1.29180\",\"High\":\"1.29265\",\"Low\":\"1.29115\"},{\"SubscriberId\":100058,\"MarketId\":1,\"Code\":\"USD.JPY\",\"Description\":\"United States dollar\",\"Symbol\":\"USD\",\"Currency\":\"JPY\",\"ContractType\":\"CASH\",\"Exchange\":\"IDEALPRO\",\"Cn_Name\":\"美元/日元\",\"En_Name\":\"USDJPY\",\"ConId\":\"100058\",\"DecimalPoint\":7,\"Ask\":\"112.478\",\"Bid\":\"112.474\",\"Pre_Close\":\"113.120\",\"High\":\"113.255\",\"Low\":\"112.425\"},{\"SubscriberId\":100061,\"MarketId\":1,\"Code\":\"AUD.USD\",\"Description\":\"Australian dollar\",\"Symbol\":\"AUD\",\"Currency\":\"USD\",\"ContractType\":\"CASH\",\"Exchange\":\"IDEALPRO\",\"Cn_Name\":\"澳元/美元\",\"En_Name\":\"AUDUSD\",\"ConId\":\"100061\",\"DecimalPoint\":7,\"Ask\":\"0.74148\",\"Bid\":\"0.74145\",\"Pre_Close\":\"0.74265\",\"High\":\"0.74320\",\"Low\":\"0.74110\"},{\"SubscriberId\":100029,\"MarketId\":1,\"Code\":\"USD.CAD\",\"Description\":\"United States dollar\",\"Symbol\":\"USD\",\"Currency\":\"CAD\",\"ContractType\":\"CASH\",\"Exchange\":\"IDEALPRO\",\"Cn_Name\":\"美元/加元\",\"En_Name\":\"USDCAD\",\"ConId\":\"100029\",\"DecimalPoint\":7,\"Ask\":\"1.36054\",\"Bid\":\"1.36050\",\"Pre_Close\":\"1.36070\",\"High\":\"1.36190\",\"Low\":\"1.36040\"},{\"SubscriberId\":100019,\"MarketId\":1,\"Code\":\"USD.CNH\",\"Description\":\"United States dollar\",\"Symbol\":\"USD\",\"Currency\":\"CNH\",\"ContractType\":\"CASH\",\"Exchange\":\"IDEALPRO\",\"Cn_Name\":\"美元/人民币\",\"En_Name\":\"USDCNH\",\"ConId\":\"100019\",\"DecimalPoint\":7,\"Ask\":\"6.87588\",\"Bid\":\"6.87587\",\"Pre_Close\":\"6.87550\",\"High\":\"6.87885\",\"Low\":\"6.87205\"},{\"SubscriberId\":100092,\"MarketId\":1,\"Code\":\"XAGUSD\",\"Description\":\"London Good Delivery\",\"Symbol\":\"XAGUSD\",\"Currency\":\"USD\",\"ContractType\":\"CMDTY\",\"Exchange\":\"SMART\",\"Cn_Name\":\"白银\",\"En_Name\":\"XAGUSD\",\"ConId\":\"100092\",\"DecimalPoint\":8,\"Ask\":\"16.90200\",\"Bid\":\"16.90000\",\"Pre_Close\":\"16.81000\",\"High\":\"16.94350\",\"Low\":\"16.82500\"},{\"SubscriberId\":100093,\"MarketId\":1,\"Code\":\"XAUUSD\",\"Description\":\"London Good Delivery\",\"Symbol\":\"XAUUSD\",\"Currency\":\"USD\",\"ContractType\":\"CMDTY\",\"Exchange\":\"SMART\",\"Cn_Name\":\"黄金\",\"En_Name\":\"XAUUSD\",\"ConId\":\"100093\",\"DecimalPoint\":8,\"Ask\":\"1243.850\",\"Bid\":\"1243.780\",\"Pre_Close\":\"1236.800\",\"High\":\"1245.120\",\"Low\":\"1236.600\"}]";
            }
            return rm;
        }

        /// <summary>
        /// 首页(市场快讯)顶部的重要品种信息
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public ReturnModel GetQuoteQueryImportant(int pageindex, int pagesize)
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

        /// <summary>
        /// 首页(市场快讯)顶部的重要品种信息
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public ReturnModel GetQueryRecommendByProductShowIndex(int product, int pageindex, int pagesize)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("product", product);
                parms.Add("pageindex", pageindex);
                parms.Add("pagesize", pagesize);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteQueryImportant, "Query_RecommendByProductShowIndex"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 市场报价首页重要品种的产品ID列表信息获取
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public ReturnModel GetQueryRecommendProduct(int pageindex, int pagesize)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("pageindex", pageindex);
                parms.Add("pagesize", pagesize);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteQueryImportant, "Query_RecommendProduct"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 根据指定的产品ID信息获得下面设置的重要品种信息以及最后一次报价数据
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public ReturnModel GetQueryRecommendByProduct(int product, int pageindex, int pagesize)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("pageindex", pageindex);
                parms.Add("pagesize", pagesize);
                parms.Add("product", product);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteQueryImportant, "Query_RecommendByProduct"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }
        /// <summary>
        /// 获取市场报价产品
        /// </summary>
        /// <param name="product"></param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public IList<ChatIndexModel> GetMarketPriceProduct(int product, int pageindex, int pagesize)
        {
            var rm = GetQueryRecommendByProduct(product, pageindex, pagesize);
            return ModelHelper<IList<ChatIndexModel>>.DeserializeObject(rm.code, rm.bodyMessage);
        }

        /// <summary>
        /// 根据指定的产品ID信息获得下面设置的重要品种信息以及最后一次报价数据
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public ReturnModel GetMinutePrice(int marketId)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("marketId", marketId);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteHistory, "GetMinutePrice"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 根据指定的产品ID信息获得下面设置的重要品种信息以及最后一次报价数据
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public ReturnModel GetQueryMarket(int pagesize, int pageindex, string condition)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("pagesize", pagesize);
                parms.Add("pageindex", pageindex);
                parms.Add("condition", condition);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQueryQuote, "QueryMarket"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 根据产品ID获得下面的品种列表信息
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public ReturnModel GetQueryPlatByProduct(int product, int pageindex, int pagesize)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("product", product);
                parms.Add("pageindex", pageindex);
                parms.Add("pagesize", pagesize);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteQueryProduct, "QueryPlatByProduct"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获得股票分时数据列表(暂时无美股数据)
        /// </summary>
        /// <param name="marketid"></param>       
        /// <returns></returns>
        public ReturnModel GetStockDeal(int marketid)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("marketid", marketid);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQueryStockDeal, "GetStockDeal"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 根据产品获得该产品下面的品种板块有哪些(主要针对的是股票)
        /// </summary>
        /// <param name="product"></param>  
        /// <param name="pagesize"></param>
        /// <param name="pageindex"></param> 
        ///  <param name="ClassificationType"></param> 
        /// <returns></returns>
        public ReturnModel GetQueryPlatInfoByProduct(int product, int pagesize, int pageindex, int ClassificationType)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("product", product);
                parms.Add("pagesize", pagesize);
                parms.Add("pageindex", pageindex);
                parms.Add("ClassificationType", ClassificationType);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteQueryPlate, "QueryPlatInfoByProduct"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 根据产品获得该产品下面的品种板块有哪些(主要针对的是股票)
        /// </summary>
        /// <param name="plate"></param>  
        /// <param name="pagesize"></param>
        /// <param name="pageindex"></param>        
        /// <returns></returns>
        public ReturnModel GetQueryMarketByPlate(int plate, int pagesize, int pageindex)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("plate", plate);
                parms.Add("pagesize", pagesize);
                parms.Add("pageindex", pageindex);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteQueryPlate, "QueryMarketByPlate"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 根据产品获得该产品下面的品种板块有哪些(主要针对的是股票)
        /// </summary>
        /// <param name="plate"></param>  
        /// <param name="pagesize"></param>
        /// <param name="pageindex"></param>        
        /// <returns></returns>
        public ReturnModel GetQueryPlateName(int plateId)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("plateId", plateId);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQuoteQueryPlate, "QueryPlateName"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }

        /// <summary>
        /// 获得品种详情信息
        /// </summary>
        /// <param name="plate"></param>  
        /// <param name="pagesize"></param>
        /// <param name="pageindex"></param>        
        /// <returns></returns>
        public ReturnModel GetQueryMarketDetail(int marketid)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("marketid", marketid);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, apiQueryQuote, "QueryMarketDetail"), parms);
            }
            catch (Exception ex)
            {
                rm.bodyMessage = ex.Message;
            }
            return rm;
        }


        /// <summary>
        /// 获取分时数据
        /// </summary>
        /// <param name="marketid"></param>       
        /// <returns></returns>
        public ReturnModel GetHistoryreconnect(string symbol, int resolution)
        {
            var rm = new ReturnModel();
            try
            {
                Dictionary<string, object> parms = new Dictionary<string, object>();
                parms.Add("symbol", symbol);
                parms.Add("resolution", resolution);
                rm = HttpRequestHelper.GetRequest<ReturnModel>(HttpApiHelper.CreateHttpApiCall(CustomConfig.ApiQuote, "historyreconnect"), parms);
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
