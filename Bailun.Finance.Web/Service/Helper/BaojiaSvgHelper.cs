using Bailun.Common.Helper;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace Bailun.Finance.Web.Service.Helper
{
    /// <summary>
    /// 
    /// </summary>
    public class BaojiaSvgHelper
    {
        #region SvgDate Html页面返回
        private static readonly object lockBaojiaSvgDate = new object();
        private static readonly object lockNewsSvgDate = new object();
        private static readonly string pathNewsIndex = "/data/txt/baojia/svgdata_newsindex_";
        private static readonly string pathBaojiaIndex = "/data/txt/baojia/svgdata_baojiaindex_";
        static int[] productIdNewsIndex = new int[] {158764, 147313, 147284, 147286, 147289, 147280, 147326, 147328, 158734, 158753, 158729, 158730, 157959, 157964, 157965, 157992, 157974, 157973, 158002, 158005, 158007, 158441, 158299, 158476, 158758, 158762, 158759, 158623, 147436, 158591, 147457, 158780, 158773, 147461, 147460, 158767, 147432, 158765, 158768 };
        static int[] productIdBaojiaIndex = new int[] { 158764, 147313, 147284, 147286, 147289, 147280, 147288, 147287, 147461, 147460, 158767, 147432, 147326, 147328, 158734, 158753, 157959, 157964, 157965, 157992, 158623, 147436, 158591, 158780, 158002, 158441, 158299, 158476, 158758, 158762, 158759 };
        private static Dictionary<string, string> dicSvgData = new Dictionary<string, string>();

        /// <summary>
        /// 获取svg数据
        /// </summary>
        /// <returns></returns>
        public static string GetSvgDataBaojiaIndex()
        {
            string key = "baojiaIndex";
            string filePath = pathBaojiaIndex + DateTime.Now.ToString("yyyyMMdd") + ".txt";
            if (dicSvgData != null && dicSvgData.ContainsKey(key))
            {
                return dicSvgData[key];
            }
            else
            {
                lock (lockBaojiaSvgDate)
                {
                    if (dicSvgData != null && dicSvgData.ContainsKey(key))
                    {
                        return dicSvgData[key];
                    }
                    else
                    {
                        //文件是否存在
                        if (FileHelper.FileExists(filePath))
                        {
                            string content = FileHelper.ReadTxt(filePath);
                            if (!string.IsNullOrEmpty(content))
                            {
                                if (dicSvgData == null)
                                    dicSvgData = new Dictionary<string, string>();

                                dicSvgData.Add(key, content);
                                return content;
                            }
                        }
                        else
                        {
                            Dictionary<int, string[]> dic = new Dictionary<int, string[]>();

                            foreach (int id in productIdBaojiaIndex)
                            {
                                var rm = FinanceQuoteService.CreateInstance().GetMinutePrice(id);
                                string[] data = ModelHelper<string[]>.DeserializeObject(rm.code, rm.bodyMessage);
                                if (data != null && data.Length > 0)
                                {
                                    dic.Add(id, data);
                                }
                            }
                            string content = ModelHelper<Dictionary<int, string[]>>.SerializeObject(dic);
                            if (!string.IsNullOrEmpty(content))
                            {
                                FileHelper.WriteTxt(filePath, content);
                                if (dicSvgData == null)
                                    dicSvgData = new Dictionary<string, string>();

                                dicSvgData.Add(key, content);
                                return content;
                            }
                        }
                    }
                }
            }
            return "";
        }
        /// <summary>
        /// 获取svg数据
        /// </summary>
        /// <returns></returns>
        public static string GetSvgDataNewsIndex()
        {
            string key = "newsIndex";
            string filePath = pathNewsIndex + DateTime.Now.ToString("yyyyMMdd") + ".txt";
            if (dicSvgData != null && dicSvgData.ContainsKey(key))
            {
                return dicSvgData[key];
            }
            else
            {
                lock (lockNewsSvgDate)
                {
                    if (dicSvgData != null && dicSvgData.ContainsKey(key))
                    {
                        return dicSvgData[key];
                    }
                    else
                    {
                        //文件是否存在
                        if (FileHelper.FileExists(filePath))
                        {
                            string content = FileHelper.ReadTxt(filePath);
                            if (!string.IsNullOrEmpty(content))
                            {
                                if (dicSvgData == null)
                                    dicSvgData = new Dictionary<string, string>();

                                dicSvgData.Add(key, content);
                                return content;
                            }
                        }
                        else
                        {
                            Dictionary<int, string[]> dic = new Dictionary<int, string[]>();
                            foreach (int id in productIdNewsIndex)
                            {
                                var rm = FinanceQuoteService.CreateInstance().GetMinutePrice(id);
                                string[] data = ModelHelper<string[]>.DeserializeObject(rm.code, rm.bodyMessage);
                                if (data != null && data.Length > 0)
                                {
                                    dic.Add(id, data);
                                }
                            }
                            string content = ModelHelper<Dictionary<int, string[]>>.SerializeObject(dic);
                            if (!string.IsNullOrEmpty(content))
                            {
                                FileHelper.WriteTxt(filePath, content);
                                if (dicSvgData == null)
                                    dicSvgData = new Dictionary<string, string>();

                                dicSvgData.Add(key, content);
                                return content;
                            }
                        }
                    }
                }
            }
            return "";
        }
        #endregion

        #region Sva生成图片
        public static void GenerateSvg()
        {
            string[] ary = new string[] { "0.603", "0.596", "0.596", "0.593", "0.591", "0.593", "0.557", "0.560", "0.568", "0.570", "0.570", "0.562", "0.580", "0.616", "0.601", "0.611", "0.611", "0.611", "0.611", "0.619" };
            // "0.603","0.596","0.596","0.593","0.591","0.593","0.557","0.560","0.568","0.570","0.570","0.562","0.580","0.616","0.601","0.611","0.611","0.611","0.611","0.619"
            // string[] ary = new string[] { "603", "596", "596", "593", "591", "593", "557", "560", "568", "570", "570", "562", "580", "616", "601", "611", "619" };

            float[] imgSize = new float[] { 200, 100 };

            //  Graphics.DrawArc(Pen pen, Rectangle rect, float startAngle, float sweepAngle)

            //宽度多出来20 作为出血
            Bitmap srcImg = new Bitmap(int.Parse(imgSize[0].ToString()) + 20, int.Parse(imgSize[1].ToString()) + 20); //也可以读入一张图片
            Graphics graphics = Graphics.FromImage(srcImg);


            Pen pen = new Pen(Color.FromArgb(0, 0, 0), 1); //颜色与宽度

            graphics.DrawCurve(pen, getPoint(ary, imgSize)); //画曲线


            //Rectangle rect = new Rectangle(0, 0, 50, 50);
            //_graphics.DrawArc(new Pen(Color.Red), rect, 0, 60);


            srcImg.Save(HttpContext.Current.Server.MapPath("example.jpg"));

            graphics.Dispose();
            srcImg.Dispose();
        }
        private static Point[] getPoint(string[] ary, float[] imgSize)
        {
            /*
             计算方式：
             Y的计算方式
            ( 当前的值 - 最小值 ) / ( 最大值 - 最小值   )       得到大于等于0  小于等于 1的值
            
            乘以图片的大小 
            
            X的计算方式                             

            当前的下标  从0开始

            数组的总长度 - 1

            （当前的下标 / 数组的总长度 - 1）* 宽度
            */
            Point[] pts = new Point[ary.Length]; //曲线的点
            try
            {
                float max = float.Parse(ary.Max());
                float min = float.Parse(ary.Min());
                float difference = max - min;
                for (var i = 0; i < ary.Length; i++)
                {
                    float imgDifference = float.Parse(ary[i]) - min;
                    int Y = Convert.ToInt32(Math.Ceiling((imgDifference / difference) * imgSize[1])) + 10;
                    int X = Convert.ToInt32(Math.Ceiling((i / float.Parse((ary.Length - 1).ToString("f1"))) * imgSize[0])) + 10;
                    pts[i] = new Point(X, Y);
                }
                return pts;
            }
            catch
            {
                return pts;
            }
        }
        #endregion
    }
}