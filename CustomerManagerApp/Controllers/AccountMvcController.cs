using CustomerManagerApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace CustomerManagerApp.Controllers
{
    [RoutePrefix("Common")]
    public class AccountMvcController : Controller
    {
        private CustomerContext CustContext;
        HttpResponseMessage response;


        [AllowAnonymous]
        [Route("options")]
        public ActionResult Options()
        {
            return View("Account");
        }

        [Authorize]
        public ActionResult Dashboard()
        {
            return View();
        }

        #region Show Recover Password form

        [AllowAnonymous]
        [HttpGet]
        [Route("RecoverPassword/{id}")]
        public ActionResult RecoverPassword(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                //  string page = "~/Views/AccountMvc/" + id + ".cshtml";
                // return new FilePathResult(page, "text/html");
                return View("ResetPassword");
            }
            return View("Account"); ;
        }

        #endregion
    }


}