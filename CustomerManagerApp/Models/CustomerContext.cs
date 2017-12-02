
using CustomerManagerApp.Areas.Products.Models;
using System.Data.Entity;

namespace CustomerManagerApp.Models
{
    [DbConfigurationType(typeof(MySql.Data.Entity.MySqlEFConfiguration))]
    public class CustomerContext : DbContext
    {
        public CustomerContext() : base("MyContext") { }

        public DbSet<Product> Products { get; set; }

    }
}