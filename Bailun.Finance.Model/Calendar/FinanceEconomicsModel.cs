using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model.Calendar
{
    /// <summary>
    /// 财经经济模型
    /// </summary>
    public class FX_FinanceEconomicsModel
    {
        /// <summary>
        /// 自增ID
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// 来源ID
        /// </summary>
        public string SourceId { get; set; }
        /// <summary>
        /// 解读ID
        /// </summary>
        public string UnscrambleId { get; set; } = "0";
        /// <summary>
        /// 日期名称（用于解读统计）
        /// </summary>
        public string DateName { get; set; }
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 来源网站
        /// </summary>
        public short Website { get; set; }
        /// <summary>
        /// (国家/地区)名称
        /// </summary>
        public string Country { get; set; }
        /// <summary>
        /// (国家/地区)图片名
        /// </summary>
        public string CountryImg { get; set; }
        /// <summary>
        /// 修正值
        /// </summary>
        public string Revised { get; set; }
        /// <summary>
        /// 前值
        /// </summary>
        public string Previous { get; set; }
        /// <summary>
        /// 预测值
        /// </summary>
        public string Consensus { get; set; }
        /// <summary>
        /// 公布值
        /// </summary>
        public string Actual { get; set; }
        /// <summary>
        /// 级别（1：一级；2：二级；3：三级；4：四级；）
        /// </summary>
        public short Level { get; set; }
        /// <summary>
        /// 重要性（1：1星； 2:2星； 3:3星； 4:4星； 5:5星；）
        /// </summary>
        public short Star { get; set; }
        /// <summary>
        /// 影响范围（0：未公布；1：无影响；2：影响较小；3：利空；4：利多；）
        /// </summary>
        public short Impact { get; set; }
        /// <summary>
        /// 添加时间
        /// </summary>
        public long AddDate { get; set; }
        /// <summary>
        /// 公布时间
        /// </summary>
        public long ReleasedDate { get; set; }
        /// <summary>
        /// 状态 1:Add; 2:Update; 3:Delete;
        /// </summary>
        public short Status { get; set; }
    }
}
