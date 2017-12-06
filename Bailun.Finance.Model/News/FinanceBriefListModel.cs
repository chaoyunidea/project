using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model.News
{
    /// <summary>
    /// 财经快讯列表模型
    /// </summary>
    public class FinanceBriefListModel
    {
        /// <summary>
        /// 金十快讯集合
        /// </summary>
        public IList<FinanceBriefModel> JSNews { get; set; }
        /// <summary>
        /// 华尔街快讯集合
        /// </summary>
        public IList<FinanceBriefModel> WallStreetcnNews { get; set; }
        /// <summary>
        /// FX168快讯集合
        /// </summary>
        public IList<FinanceBriefModel> Fx168News { get; set; }
        /// <summary>
        /// FX678快讯集合
        /// </summary>
        public IList<FinanceBriefModel> Fx678News { get; set; }
        /// <summary>
        /// DAILYFX快讯集合
        /// </summary>
        public IList<FinanceBriefModel> DailyFxnEews { get; set; }
    }
}
