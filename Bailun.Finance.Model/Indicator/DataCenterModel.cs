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
    public class DataCenterModel
    {
        public int Id { get; set; }

        public string Itemname { get; set; }

        public string Currentvalue { get; set; }

        public string Predvalue { get; set; }

        public string Frontvalue { get; set; }

        public string Valuetime { get; set; }
        
    }

    


}
