using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomerManagerApp.Areas.Products.Models
{
    public class Product
    {
        public Guid ProductId { get; set; }

        public string ProductName { get; set; }

        public string ProductDiscription { get; set; }

        public double Price { get; set; }

        public double Discount { get; set; }

        public byte[] ProductImage { get; set; }

    }
}