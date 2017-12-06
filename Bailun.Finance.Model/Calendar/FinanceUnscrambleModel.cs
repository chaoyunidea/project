using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model.Calendar
{
    /// <summary>
    /// 财经解读模型
    /// </summary>
    public class FinanceUnscrambleModel
    {
        /// <summary>
        /// 自增ID
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// 财经经济ID
        /// </summary>
        public int EconomicsId { get; set; }
        /// <summary>
        /// 财经经济标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 下次公布时间
        /// </summary>
        public long PublicTime { get; set; }
        /// <summary>
        /// 来源ID
        /// </summary>
        public string SourceId { get; set; }
        /// <summary>
        /// 来源网站
        /// </summary>
        public short Website { get; set; }
        /// <summary>
        /// 数据公布机构
        /// </summary>
        public string Institutions { get; set; }
        /// <summary>
        /// 发布频率
        /// </summary>
        public string Frequency { get; set; }
        /// <summary>
        /// 数据影响
        /// </summary>
        public string DataImpact { get; set; }
        /// <summary>
        /// 统计方法
        /// </summary>
        public string Method { get; set; }
        /// <summary>
        /// 数据释义
        /// </summary>
        public string Paraphrase { get; set; }
        /// <summary>
        /// 关注理由(趣味解读)
        /// </summary>
        public string Focus { get; set; }
    }
}
