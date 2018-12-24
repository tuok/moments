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
    public class EntriesController : BaseController
    {
        public EntriesController(IDatabase database) : base(database) {}

        // GET api/entries
        public string Get(int? id, int? limit, int? begin, int? end)
        {
            if (id.HasValue)
            {
                Entry e = this.Database.GetEntry(id.Value);

                return e == null ? "{}" : JsonConvert.SerializeObject(e);
            }

            if (limit.HasValue && limit < this.Database.Entries.Count)
            {
                return JsonConvert.SerializeObject(
                    this.Database.Entries.GetRange(
                        this.Database.Entries.Count - limit.Value,
                        limit.Value
                    )
                );
            }

            if (begin.HasValue && end.HasValue && 1 <= begin.Value && begin.Value < this.Database.Entries.Count)
            {
                int be = begin.Value;
                int en = end.Value;

                if (begin.Value < 1)
                    be = 1;

                if (end.Value >= this.Database.Entries.Count)
                    en = this.Database.Entries.Count;

                int range = en - be + 1;

                return JsonConvert.SerializeObject(
                    this.Database.Entries.GetRange(be - 1, range)
                );
            }

            return JsonConvert.SerializeObject(this.Database.Entries);
        }

        [HttpPost]
        public Entry Post([FromBody]Entry entry)
        {
            return Database.AddEntry(entry);
        }

        [HttpGet("saveall")]
        public string SaveAll()
        {
            try
            {
                foreach (var entry in Database.Entries)
                    Database.SaveEntry(entry);
            }
            catch (Exception e)
            {
                return JsonConvert.SerializeObject(new { result = "error", message = e.Message });
            }

            return JsonConvert.SerializeObject(new { result = "ok", message = "All entries saved successfully to disk." });

        }
    }
}
