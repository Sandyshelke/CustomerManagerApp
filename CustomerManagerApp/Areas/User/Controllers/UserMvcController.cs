using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CustomerManagerApp.Areas.User.Controllers
{
    public class UserMvcController : Controller
    {
        [AllowAnonymous]
        [HttpGet]
        public ActionResult RecoverPassword(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                string page = "~/Areas/User/Views/UserMvc/" + id + ".cshtml";
                return new FilePathResult(page, "text/html");
            }
            return new FilePathResult("~/html/login.html", "text/html");
        }
    }
}