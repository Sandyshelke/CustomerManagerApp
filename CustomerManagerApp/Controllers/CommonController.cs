using CustomerManagerApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace CustomerManagerApp.Controllers
{
    public class CommonController : Controller
    {
        private CustomerContext CustContext;
        HttpResponseMessage response;

        public ActionResult Options()
        {
            return View("Account");
        }
        [Authorize]
        public ActionResult Dashboard()
        {
            return View();
        }

    }
}