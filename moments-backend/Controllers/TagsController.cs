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
        public string Get(string s, int? limit, bool? frequencies)
        {
            List<string> tags = new List<string>();
            List<int> freqs = new List<int>();
            Dictionary<string, int> retVals = new Dictionary<string, int>();

            if (s != null)
            {
                if (limit.HasValue && db.TagsFrequencies.Count >= limit)
                    retVals = new Dictionary<string, int>(db.TagsFrequencies.Where(kvp => kvp.Key.Contains(s)).Take(limit.Value));
                else
                    retVals = new Dictionary<string, int>(db.TagsFrequencies.Where(kvp => kvp.Key.Contains(s)));
            }

            // No search term provided, return all tags
            else
            {
                if (limit.HasValue && db.TagsFrequencies.Count >= limit)
                    retVals = new Dictionary<string, int>(db.TagsFrequencies.Take(limit.Value));

                else
                    retVals = db.TagsFrequencies;
            }

            if (frequencies.HasValue && frequencies.Value)
                return JsonConvert.SerializeObject(retVals);
            else
                return JsonConvert.SerializeObject(retVals.Keys);
        }
    }
}
