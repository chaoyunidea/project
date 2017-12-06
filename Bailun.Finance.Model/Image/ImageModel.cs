using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bailun.Finance.Model.Image
{
    /// <summary>
    /// 大图
    /// </summary>
    public class ImageOneModel
    {
        public ImageOneModel(string big, string description)
        {
            Big = big;
            Descriptiong = description;
        }
        /// <summary>
        /// 大图
        /// </summary>
        public string Big { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Descriptiong { get; set; }
    }
    /// <summary>
    /// 大小图
    /// </summary>
    public class ImageTwoModel
    {
        public ImageTwoModel(string small, string big, string description)
        {
            Small = small;
            Big = big;
            Descriptiong = description;
        }
        /// <summary>
        /// 小图
        /// </summary>
        public string Small { get; set; }
        /// <summary>
        /// 大图
        /// </summary>
        public string Big { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Descriptiong { get; set; }
    }
    /// <summary>
    /// 大中小图
    /// </summary>
    public class ImageThreeModel
    {
        public ImageThreeModel(string small, string middle, string big, string description)
        {
            Small = small;
            Middle = middle;
            Big = big;
            Descriptiong = description;
        }
        /// <summary>
        /// 小图
        /// </summary>
        public string Small { get; set; }
        /// <summary>
        /// 中图
        /// </summary>
        public string Middle { get; set; }
        /// <summary>
        /// 大图
        /// </summary>
        public string Big { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Descriptiong { get; set; }
    }
    /// <summary>
    /// 大图
    /// </summary>
    public class ImageModel1
    {
        public ImageModel1(string big, string description)
        {
            Big = big;
            Description = description;
        }
        /// <summary>
        /// 大图
        /// </summary>
        public string Big { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }
    }
    /// <summary>
    /// 大小图
    /// </summary>
    public class ImageModel2
    {
        public ImageModel2()
        {
            Small = "http://img1.fx110.com/Public/images/default/default_s_fx110.png";
            Big = "http://img1.fx110.com/Public/images/default/default_b_fx110.png";
            Description = "";
        }
        public ImageModel2(string small, string big, string description)
        {
            Small = small;
            Big = big;
            Description = description;
        }
        /// <summary>
        /// 小图
        /// </summary>
        public string Small { get; set; }
        /// <summary>
        /// 大图
        /// </summary>
        public string Big { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }
    }
    /// <summary>
    /// 大中小图
    /// </summary>
    public class ImageModel3
    {
        /// <summary>
        /// 自动填充默认图片
        /// </summary>
        public ImageModel3()
        {
            Small = "http://img1.fx110.com/Public/images/default/default_s_fx110.png";
            Middle = "http://img1.fx110.com/Public/images/default/default_m_fx110.png";
            Big = "http://img1.fx110.com/Public/images/default/default_b_fx110.png";
            Description = "";
        }
        public ImageModel3(string small, string middle, string big, string description)
        {
            Small = small;
            Middle = middle;
            Big = big;
            Description = description;
        }
        /// <summary>
        /// 小图
        /// </summary>
        public string Small { get; set; }
        /// <summary>
        /// 中图
        /// </summary>
        public string Middle { get; set; }
        /// <summary>
        /// 大图
        /// </summary>
        public string Big { get; set; }
        /// <summary>
        /// 描述 Description
        /// </summary>
        public string Description { get; set; }
    }
    /// <summary>
    /// 大中小图(完整，带URL链接地址)
    /// </summary>
    public class ImageModel
    {
        /// <summary>
        /// 自动填充默认图片
        /// </summary>
        public ImageModel()
        {
            Small = "http://img1.fx110.com/Public/images/default/default_s_fx110.png";
            Middle = "http://img1.fx110.com/Public/images/default/default_m_fx110.png";
            Big = "http://img1.fx110.com/Public/images/default/default_b_fx110.png";
            Url = "";
            Sort = 1;
            Title = "";
            Description = "";
        }
        public ImageModel(string small, string middle, string big, string url, int sort, string title, string description)
        {
            Small = small;
            Middle = middle;
            Big = big;
            Url = url;
            Sort = sort;
            Title = title;
            Description = description;
        }
        /// <summary>
        /// 小图
        /// </summary>
        public string Small { get; set; }
        /// <summary>
        /// 中图
        /// </summary>
        public string Middle { get; set; }
        /// <summary>
        /// 大图
        /// </summary>
        public string Big { get; set; }
        /// <summary>
        /// 链接
        /// </summary>
        public string Url { get; set; }
        /// <summary>
        /// 排序号
        /// </summary>
        public int Sort { get; set; }
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }
    }
}
