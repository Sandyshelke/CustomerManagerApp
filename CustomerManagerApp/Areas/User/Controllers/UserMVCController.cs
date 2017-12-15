using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using CustomerManagerApp.Models;

namespace CustomerManagerApp.Areas.User.Controllers
{
    public class UserMVCController : Controller
    {
        private ApplicationDbContext Context = new ApplicationDbContext();
        // GET: User/UserMVC
        public ActionResult Profile()
        {
            return View();
        }

        public ActionResult ProfilePicture()
        {
            byte[] imageData = null;
            if (Request.Files.Count > 0)
            {
                HttpPostedFileBase poImgFile = Request.Files["UserPhoto"];

                using (var binary = new BinaryReader(poImgFile.InputStream))
                {
                    imageData = binary.ReadBytes(poImgFile.ContentLength);
                }
            }

            var uid = User.Identity.GetUserId();
            var user = (from u in Context.Users
                        where u.Id == uid
                        select u).SingleOrDefault();
            user.UserPhoto = imageData;
            Context.SaveChanges();

            //Here we pass the byte array to user context to store in db
            // user.UserPhoto = imageData;
            return View("Profile");
        }


        public ActionResult MyProfilePicture()
        {

            var uid = User.Identity.GetUserId();
            var user = (from u in Context.Users
                        where u.Id == uid
                        select u).SingleOrDefault();
            return new FileContentResult(user.UserPhoto, "image/jpeg");
        }
    }
}