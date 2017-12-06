using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model.Quote
{
    /// <summary>
    /// 实时报价模型
    /// </summary>
    public class QueryTimelyModel
    {
        public int MarketDetailId { get; set; }

        public string En_Name { get; set; }

        public string Cn_name { get; set; }

        public bool IsSubscribered { get; set; }

        public decimal Ask { get; set; }

        public decimal Bid { get; set; }

        public decimal Pre_Close { get; set; }

        public decimal High { get; set; }
        public decimal Low { get; set; }

        public int DecimalPoint { get; set; }
    }

    /// <summary>
    /// 实时报价模型
    /// </summary>
    public class QueryDetailModel
    {
        public int MarketId{ get; set; }

        public int ProductId { get; set; }

        public string En_Name { get; set; }

        public string Cn_name { get; set; }

        public string Code { get; set; }

        public decimal CurrentPrice { get; set; }

        public decimal OpenPrice { get; set; }

        public decimal ClosePrice { get; set; }

        public decimal HighPrice { get; set; }

        public decimal LowPrice { get; set; }

        public string LastPriceTime { get; set; }

        public bool IsDelayData { get; set; }

        /// <summary>
        /// 涨跌额
        /// </summary>
        public string PriceLimit{get;set;}

        /// <summary>
        /// 涨跌幅
        /// </summary>
        public string PriceExchange{get;set;}

        //public int DecimalPoint { get; set; }
    }
}
