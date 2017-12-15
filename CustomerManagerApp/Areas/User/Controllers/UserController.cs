using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Remoting.Contexts;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using CustomerManagerApp.Models;

namespace CustomerManagerApp.Areas.User.Controllers
{
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        private ApplicationDbContext Context = new ApplicationDbContext();
        HttpResponseMessage response = new HttpResponseMessage();

        #region Get user Profile
        [Route("profile")]
        [HttpGet]
        public IHttpActionResult GetUserProfile()
        {
            var uid = User.Identity.GetUserId();
            var query = from u in Context.Users
                        where u.Id == uid
                        select (new
                        {
                            Name = u.Name,
                            Email = u.Email,
                            EmailConfirmed = u.EmailConfirmed,
                            PhoneNumber = u.PhoneNumber,
                            PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                            TwoFactorEnabled = u.TwoFactorEnabled
                        });
            var user = query.FirstOrDefault();
            if (user != null)
                return Ok(user);
            return BadRequest();
        }
        #endregion

        #region UpdateProfile
        [Route("profile")]
        [HttpPost]
        public IHttpActionResult UpdateProfileInfo([FromBody] ApplicationUser updateData)
        {
            ApplicationUser user = new ApplicationUser(); ;
            try
            {
                var uid = User.Identity.GetUserId();
                user = (from u in Context.Users
                        where u.Id == uid
                        select u).SingleOrDefault();
                user.PhoneNumber = updateData.PhoneNumber;
                user.Name = updateData.Name;
                Context.SaveChanges();
                return GetUserProfile(); 
            }
            catch (Exception ex)
            {
                response = Request.CreateResponse(HttpStatusCode.OK, ex.ToString());
                return BadRequest();
            }
        }
        #endregion
    }
}
