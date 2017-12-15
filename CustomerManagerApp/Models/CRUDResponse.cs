using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomerManagerApp.Models
{
    public class CRUDResponse
    {
        CRUDResponse(string message)
        {


        }
        public string Message { get; set; }

        public int ErrorCode { get; set; }

        public string ErrorMessage { get; set; }
    }
}