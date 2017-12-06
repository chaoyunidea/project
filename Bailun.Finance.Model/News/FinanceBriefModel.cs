using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model.News
{
    /// <summary>
    /// 财经快讯实体
    /// </summary>
    public class FinanceBriefModel
    {
        /// <summary>
        /// 自增主键ID
        /// </summary>
        public int Id
        {
            get; set;
        }
        /// <summary>
        /// 标题
        /// </summary>
        public string Title
        {
            get; set;
        }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content
        {
            get; set;
        }
        /// <summary>
        /// 来源网站（1：金十；2：华尔街；3：fx168；4：fx678；5：DailyFx;）
        /// </summary>
        public short Website
        {
            get; set;
        }
        /// <summary>
        /// 类型（0、新闻；1、日历；）
        /// </summary>
        public short Type
        {
            get; set;
        }
        /// <summary>
        /// 级别（1：一般；2：重要；3：很重要；4：非常重要）
        /// </summary>
        public short Level
        {
            get; set;
        }
        /// <summary>
        /// 来源新闻ID
        /// </summary>
        public string SourceId
        {
            get; set;
        }
        /// <summary>
        /// 配图
        /// </summary>
        public string SmallImg
        {
            get; set;
        }
        /// <summary>
        /// 公布时间
        /// </summary>
        public long ReleasedDate
        {
            get; set;
        }

        /// <summary>
        /// 公布时间
        /// </summary>
        public long AddDate
        {
            get; set;
        }

        /// <summary>
        /// 修正值
        /// </summary>
        public string Revised
        {
            get; set;
        }
        /// <summary>
        /// 前值
        /// </summary>
        public string Previous
        {
            get; set;
        }
        /// <summary>
        /// 预测值
        /// </summary>
        public string Consensus
        {
            get; set;
        }
        /// <summary>
        /// 公布值
        /// </summary>
        public string Actual
        {
            get; set;
        }
        /// <summary>
        /// 国家
        /// </summary>
        public string Country
        {
            get; set;
        }
        /// <summary>
        /// 国家图片
        /// </summary>
        public string CountryImg
        {
            get; set;
        }
        /// <summary>
        /// 重要性（1：1星； 2:2星； 3:3星； 4:4星； 5:5星；）
        /// </summary>
        public short Star
        {
            get; set;
        }
        /// <summary>
        /// 影响范围（0：未公布；1：无影响；2：影响较小；3：利空；4：利多；）
        /// </summary>
        public short Impact
        {
            get; set;
        }


        /// <summary>
        /// 备注/注释
        /// </summary>
        public string Remark { get; set; }
        /// <summary>
        /// 1:Add; 2:Update; 3:Delete;
        /// </summary>
        public short Status { get; set; }
    }
}
