using System.Collections.Generic;

namespace Bailun.Finance.Model.Share
{
    /// <summary>
    /// 报名信息
    /// </summary>
    public class RegisterModel
    {
        /// <summary>
        /// ID
        /// </summary>
        public int RegisterId { get; set; }
        /// <summary>
        /// 报名类型（属于某次活动）
        /// </summary>
        public int RegisterTypeId { get; set; }
        /// <summary>
        /// 报名申请用户类别
        /// </summary>
        public short ExhibitorsType { get; set; }
        /// <summary>
        /// 报名时间
        /// </summary>
        
        public string RegisterTime { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public int Uid { get; set; }
        /// <summary>
        /// 公司
        /// </summary>
        
        public string CompanyName { get; set; }
        /// <summary>
        /// 公司网址
        /// </summary>
        
        public string CompanyWebsite { get; set; }
        /// <summary>
        /// 联系人
        /// </summary>
        
        public string Contacts { get; set; }
        /// <summary>
        /// 职位
        /// </summary>
        public string Position { get; set; }
        /// <summary>
        /// 手机
        /// </summary>
        
        public string Mobile { get; set; }
        /// <summary>
        /// QQ
        /// </summary>
        
        public string QQ { get; set; }
        /// <summary>
        /// 微信号
        /// </summary>
        public string Weixin { get; set; }
        /// <summary>
        /// 邮箱
        /// </summary>

        public string Email { get; set; }
        /// <summary>
        /// 地址
        /// </summary>
        
        public string Address { get; set; }
        /// <summary>
        /// 验证邮箱
        /// </summary>
        
        public bool EmailVerification { get; set; }
        /// <summary>
        /// 报名留言
        /// </summary>
        
        public string LeaveMessage { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        
        public string Remark { get; set; }
        /// <summary>
        /// 附加信息
        /// </summary>
        
        public string OtherInfo { get; set; }
        /// <summary>
        /// 审核意见
        /// </summary>
        public string AuditOpinion { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public short State { get; set; }
    }
}
