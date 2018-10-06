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
        public string Get(string s, int? limit)
        {
            if (s != null)
            {
                List<string> tags = new List<string>();

                foreach(string tag in db.Tags)
                {
                    if (tag.Contains(s))
                    {
                        tags.Add(tag);

                        if (limit.HasValue && tags.Count >= limit)
                            break;
                    }
                }

                return JsonConvert.SerializeObject(tags);
            }

            // No search term provided, return all tags
            else
            {
                if (limit.HasValue)
                    return JsonConvert.SerializeObject(db.Tags.GetRange(0, limit.Value));

                else
                    return JsonConvert.SerializeObject(db.Tags);
            }
        }
    }
}
