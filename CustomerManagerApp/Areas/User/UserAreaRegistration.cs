﻿using System.Web.Mvc;

namespace CustomerManagerApp.Areas.User
{
    public class UserAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "User";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "User_default",
                "User/{controller}/{action}/{id}",
                new { Controller="UserMVC", action = "Profile", id = UrlParameter.Optional }
            );
        }
    }
}