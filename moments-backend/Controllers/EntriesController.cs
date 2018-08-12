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
    [Route("api/[controller]")]
    public class EntriesController : Controller
    {
        private IDatabase db;

        public EntriesController(IDatabase database) {
            this.db = database;
        }

        // GET api/entries
        public string Get(int? id, int? limit, int? begin, int? end)
        {
            if (id.HasValue)
            {
                Entry e = this.db.GetEntry(id.Value);

                return e == null ? "{}" : JsonConvert.SerializeObject(e);
            }

            if (limit.HasValue && limit < this.db.Entries.Count)
            {
                return JsonConvert.SerializeObject(
                    this.db.Entries.GetRange(
                        this.db.Entries.Count - limit.Value,
                        limit.Value
                    )
                );
            }

            if (begin.HasValue && end.HasValue && 1 <= begin.Value && begin.Value < this.db.Entries.Count)
            {
                int be = begin.Value;
                int en = end.Value;

                if (begin.Value < 1)
                    be = 1;

                if (end.Value >= this.db.Entries.Count)
                    en = this.db.Entries.Count;

                int range = en - be + 1;

                return JsonConvert.SerializeObject(
                    this.db.Entries.GetRange(be - 1, range)
                );
            }

            return JsonConvert.SerializeObject(this.db.Entries);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
