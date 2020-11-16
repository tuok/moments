using Microsoft.AspNetCore.Mvc;

using Moments.Interfaces;

namespace Moments.Controllers
{
    public class BaseController : Controller
    {
        public IDatabase Database { get; }

        public BaseController(IDatabase database) {
            Database = database;
        }
    }
}
