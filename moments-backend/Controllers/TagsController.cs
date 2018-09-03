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
    [Route("api/tags")]
    public class TagsController : Controller
    {
        private IDatabase db;

        public TagsController(IDatabase database) {
            this.db = database;
        }

        // GET api/tags
        public string Get()
        {
            return JsonConvert.SerializeObject(this.db.Tags);
        }
    }
}
