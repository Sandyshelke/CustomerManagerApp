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
        [Route("Dashboard")]
        public ActionResult Dashboard()
        {
            return View();
        }

        #region Show Account Activation Form

        [AllowAnonymous]
        [HttpGet]
        [Route("ActivationStatus/{id}")]
        public ActionResult ShowActivationStatus(string id)
        {
            if (id=="success")
                ViewBag.result = "Your Account is active Please wait...";
            else
                ViewBag.result = "Your Account is not active Please try again";
            return View();
        }

        #endregion


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