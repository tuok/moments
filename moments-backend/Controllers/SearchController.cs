using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;

using Moments.Models;
using Moments.Interfaces;


namespace Moments.Controllers
{
    [Route("api/entries/search")]
    public class SearchController : Controller
    {
        private IDatabase db;

        public SearchController(IDatabase database) {
            this.db = database;
        }

        // GET api/entries
        public string Get([FromQuery] string[] searchTerms, [FromQuery] bool fulltext)
        {
            return "{}";
        }
    }
}
