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
    [Route("api/entries")]
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

        [HttpPut]
        public Entry Put([FromBody]Entry entry)
        {
            return db.AddEntry(entry);
        }

        [HttpPost]
        public void Post([FromBody]Entry entry)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
