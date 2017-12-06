using Bailun.Common.Helper;
using Bailun.Finance.Model.Calendar;
using Bailun.Finance.Model.Quote;
using Bailun.Finance.Web.Service;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Bailun.Common.Extensions;
using System.Linq;
using Bailun.Finance.Model.News;
using Bailun.Finance.Web.Service.Helper;

namespace Bailun.Finance.Web.Controllers
{
    public class SharedViewController : Controller
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult Top()
        {
            return View();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult Footer()
        {
            return View();
        }
        /// <summary>
        /// 财经日历
        /// </summary>
        /// <param name="topSize"></param>
        /// <returns></returns>
        public ActionResult FinancialCalendar(int topSize = 4)
        {
            var rm = FinanceCalendarService.CreateInstance().GetFinanceEconomicsNew(topSize);
            var model = ModelHelper<List<FX_FinanceEconomicsModel>>.DeserializeObject(rm.code, rm.bodyMessage);
            //var newModel = GetFirstLastTwo(model);
            //ViewBag.NewModelJson = ModelHelper<List<FX_FinanceEconomicsModel>>.SerializeObject(newModel);
            //ViewBag.model = ModelHelper<List<FX_FinanceEconomicsModel>>.SerializeObject(model);
            return View(model);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult MarketWatch()
        {
            var rm = FinanceQuoteService.CreateInstance().GetChatIndexForBailun();
            var model = ModelHelper<List<ChatIndexModel>>.DeserializeObject(rm.code, rm.bodyMessage);
            ViewBag.ModelList = rm.bodyMessage.ConvertToEmpty();
            return View(model);
        }

        public ActionResult MarketBrief(int topSize)
        {
            var rm = FinanceNewsService.CreateInstance().GetFinanceAllBrief(topSize);
            var model = ModelHelper<FinanceBriefListModel>.DeserializeObject(rm.code, rm.bodyMessage);
            return View(model);
        }
        /// <summary>
        /// 报价svgdata
        /// </summary>
        /// <returns></returns>
        public ActionResult SvgData(short type = 1)
        {
            ViewBag.SvgData = type == 1 ? BaojiaSvgHelper.GetSvgDataNewsIndex() : BaojiaSvgHelper.GetSvgDataBaojiaIndex();
            return View();
        }

        /// <summary>
        /// 获取包含指定时间在内的前后共4条记录
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        List<FX_FinanceEconomicsModel> GetFirstLastTwo(List<FX_FinanceEconomicsModel> list)
        {
            List<FX_FinanceEconomicsModel> newList = new List<FX_FinanceEconomicsModel>();
            if (list != null && list.Count > 4)
            {
                int count = list.Count;
                long nowTime = DateExtensions.ConvertDateTimeInt(DateTime.Now);
                int index = 0;
                foreach (FX_FinanceEconomicsModel m in list)
                {
                    if (m.ReleasedDate >= nowTime)
                    {
                        break;
                    }
                    else
                    {
                        index++;
                    }
                }
                if (index == 0 || index == 1)
                {
                    newList = list.Take(4).OrderBy(x => x.ReleasedDate).ToList();
                }
                else if (index == 2)
                {
                    newList = list.Skip(1).Take(4).OrderBy(x => x.ReleasedDate).ToList();
                }
                else
                {
                    int addCount = 0;
                    for (int k = index; k < count; k++)
                    {
                        if (addCount < 2)
                        {
                            newList.Add(list[k]);
                            addCount++;
                        }
                        else
                        {
                            break;
                        }
                    }
                    addCount = newList.Count;
                    for (int k = index - 1; k > -1; k--)
                    {
                        if (addCount < 4)
                        {
                            newList.Add(list[k - 1]);
                            addCount++;
                        }
                        else
                        {
                            break;
                        }
                    }
                    newList = newList.OrderBy(x => x.ReleasedDate).ToList();
                }
                return newList;
            }

            return list;
        }


    }
}