using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bailun.Finance.Web.Controllers
{
    public class DownloadController : Controller
    {
        // GET: Download
        public ActionResult App()
        {
            return View();
        }

        // GET: Download
        public ActionResult MobileApp()
        {
            return View();
        }
    }
}