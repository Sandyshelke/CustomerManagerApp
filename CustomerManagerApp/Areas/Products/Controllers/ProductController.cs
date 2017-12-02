using CustomerManagerApp.Areas.Products.Models;
using CustomerManagerApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CustomerManagerApp.Areas.Products.Controllers
{
    [Authorize]
    public class ProductController : ApiController
    {
        private CustomerContext CustContext;
        HttpResponseMessage response;

        public ProductController() { CustContext = new CustomerContext(); }

        public IEnumerable<Product> Get()
        {

            return CustContext.Products.ToList();
        }

        public HttpResponseMessage Post([FromBody] Product newProduct)
        {
            try
            {
                newProduct.ProductId = Guid.NewGuid();
                CustContext.Products.Add(newProduct);
                CustContext.SaveChanges();
                response = Request.CreateResponse(HttpStatusCode.OK, "Product Added");
                return response;
            }
            catch (Exception ex)
            {
                response = Request.CreateResponse(HttpStatusCode.OK, ex.ToString());
                return response;
            }
        }

    }
}
