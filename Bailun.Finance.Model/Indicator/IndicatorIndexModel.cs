using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Bailun.Finance.Model.Indicator
{
    /// <summary>
    /// jin10数据详情模型
    /// </summary>
    public class GlobalEconomicModel
    {
        /// <summary>
        /// 
        /// </summary>
        public string[] fields { get; set; }
        public string[] names { get; set; }
        ///// <summary>
        ///// 
        ///// </summary>
        //public IList<string[]> items { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public IList<IList<string[]>> items { get; set; }


    }

    


}
