using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Bailun.Finance.Model.Indicator
{
   

    /// <summary>
    /// 指标详情模型
    /// </summary>
    public class IndicatorDetailModel
    {
        public int Id { get; set; }

        public string Itemname { get; set; }


        public string Name { get; set; }

        public int Country { get; set; }

        public string CountryName { get; set; }


        public string MainItems { get; set; }

        public decimal Real { get; set; }

        public string PreValue { get; set; }

        public string Publishat { get; set; }

        public int Indicator { get; set; }

        public decimal FrontValue { get; set; }

        public string Unit { get; set; }

        public string Organization { get; set; }

    }

    /// <summary>
    /// 目录结构模型
    /// </summary>
    public class IndicatorMenuModel 
    {
        /// <summary>
       /// </summary>
        public MainItemModel main_indicator { get; set; }

        public IList<ItemSubModel> itemsub { get; set; }

    }

    /// <summary>
    /// 国家结构模型
    /// </summary>
    public class CountryDetailModel
    {
        /// <summary>
        /// 国家
        /// </summary>
        public int Id { get; set; }

        public string Country { get; set; }


        public string Show { get; set; }

        public string SortLetter { get; set; }

        public string cflag { get; set; }

    }

 


    public class MainItemModel
    {
        public int id { get; set; }

        public string name { get; set; }

        public string sortletter { get; set; }
    }

    public class ItemSubModel
    {
        public string Names { get; set; }

        public string Codes { get; set; }

        public string Units{ get; set; }
    }


}
