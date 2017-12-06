using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model.Enums
{
    /// <summary>
    /// 发布状态
    /// </summary>
    public enum ReleaseStateDefine : short
    {
        全部 = -1,
        待公布 = 0,
        已公布 = 1,
    }

    /// <summary>
    /// 重要性
    /// </summary>
    public enum ImportanceDefine : short
    {
        全部 = -1,
        /// <summary>
        /// 一星
        /// </summary>
        一星 = 1,
        /// <summary>
        /// 二星
        /// </summary>
        二星 = 2,
        /// <summary>
        /// 三星
        /// </summary>
        三星 = 3,
        /// <summary>
        /// 二星
        /// </summary>
        四星 = 4,
        /// <summary>
        /// 二星
        /// </summary>
        五星 = 5
    }

    /// <summary>
    /// 影响范围
    /// </summary>
    public enum ImpactDefine : short
    {
        未公布 = 0,
        无影响 = 1,
        影响较小 = 2,
        利空 = 3,
        利多 = 4
    }

    /// <summary>
    /// 股票市场
    /// </summary>
    public enum StockMarket : short
    {
        沪深 = 6,
        港股 = 7,
        美股 = 8
    }

    /// <summary>
    /// 股票市场英文名
    /// </summary>
    public enum PriceType : short
    {
        ashares = 6,
        hkstock = 7,
        usstock = 8
    }

    /// <summary>
    /// 股票市场版块名称
    /// </summary>
    public enum plateType : short
    {
        行业版块 = 1,
        概念版块 = 2,
        特有版块 = 3
    }
}
