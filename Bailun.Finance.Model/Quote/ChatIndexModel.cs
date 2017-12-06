using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model.Quote
{
    public class ChatIndexModel
    {
        public int SubscriberId { get; set; }

        public int MarketId { get; set; }

        public string Code { get; set; }

        public string Description { get; set; }

        public string Symbol { get; set; }

        public string Currency { get; set; }

        public string ContractType { get; set; }

        public string Exchange { get; set; }

        public string Cn_Name { get; set; }

        public string En_Name { get; set; }

        public string ConId { get; set; }

        public int DecimalPoint { get; set; }

        public string AskPrice { get; set; }

        public decimal CurrentPrice { get; set; }

        public decimal ClosePrice { get; set; }

        public decimal OpenPrice { get; set; }
        

        public string HighPrice { get; set; }

        public string LowPrice { get; set; }
        public string Price_TimeZone { get; set; }
        public string PriceDate { get; set; }
        /// <summary>
        /// 涨跌额
        /// </summary>
        public string PriceLimit { get; set; }

        /// <summary>
        /// 涨跌幅
        /// </summary>
        public string PriceExchange { get; set; }
    }
}
