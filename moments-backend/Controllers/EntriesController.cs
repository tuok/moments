using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moments.DTO;
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
        public string Get([FromBody] EntryParams parameters)
        {
            var id = parameters?.Id;
            var searchTerm = parameters?.SearchTerm;
            var begin = parameters?.Begin;
            var end = parameters?.End;
            var tags = parameters?.Tags;

            var results = new List<Entry>();

            // Get entry by id if provided.
            if (id.HasValue)
            {
                Entry e = Database.GetEntry(id.Value);

                if (e != null)
                    results.Add(e);
            }

            else
                results = Database.Entries;

            // Filter entries by tags if provided.
            if (tags != null && tags.Count > 0)
                results = results.Where(e => tags.All(tag => e.Tags.Contains(tag))).ToList();

            // Filter entries by search term if provided.
            if (!string.IsNullOrEmpty(searchTerm))
                results = results.Where(e => e.Text.ContainsIgnoreCase(searchTerm)).ToList();

            if (begin.HasValue && end.HasValue && 1 <= begin.Value && begin.Value < Database.Entries.Count)
            {
                int be = begin.Value;
                int en = end.Value;

                if (begin.Value < 1)
                    be = 1;

                if (end.Value >= Database.Entries.Count)
                    en = Database.Entries.Count;

                int range = en - be + 1;

                results = results.GetRange(be - 1, range);
            }

            return JsonConvert.SerializeObject(results);
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
