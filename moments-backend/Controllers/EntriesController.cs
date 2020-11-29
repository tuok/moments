using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Moments.DTO;

using Moments.Models;
using Moments.Interfaces;

namespace Moments.Controllers
{
    [Route("api/entries")]
    public class EntriesController : BaseController
    {
        public EntriesController(IDatabase database) : base(database) {}

        // POST api/entries/search
        [HttpPost("search")]
        public ActionResult Search([FromBody] EntryParams parameters)
        {
            var id = parameters?.Id;
            var searchTerm = parameters?.SearchTerm;
            var begin = parameters?.Begin;
            var end = parameters?.End;
            var startDate = parameters?.StartDate;
            var endDate = parameters?.EndDate;
            var tags = parameters?.Tags;
            var reverse = parameters?.Reverse;

            if (!begin.HasValue || !end.HasValue)
            {
                begin = 1;
                end = 20;
            }

            var resultList = new List<Entry>();

            // Get entry by id if provided.
            if (id.HasValue)
            {
                Entry e = Database.GetEntry(id.Value);

                if (e != null)
                    resultList.Add(e);
            }

            else
                resultList = Database.Entries;

            IEnumerable<Entry> results = resultList;

            // Filter entries by tags if provided.
            if (tags != null && tags.Count > 0)
                results = results.Where(e => tags.All(tag => e.Tags.Contains(tag)));

            // Filter entries by search term if provided.
            if (!string.IsNullOrEmpty(searchTerm))
                results = results.Where(e => e.Text.ContainsIgnoreCase(searchTerm));

            // Filter entries by dates if provided.
            if (startDate.HasValue)
            {
                results = results.Where(e => startDate <= e.StartTime);
            }

            if (endDate.HasValue)
            {
                results = results.Where(e => e.StartTime < endDate);
            }

            resultList = results.ToList();
            resultList.Sort();

            if (!(reverse.HasValue && reverse.Value))
            {
                resultList.Reverse();
            }

            if (1 <= begin.Value && begin.Value < resultList.Count)
            {
                int be = begin.Value;
                int en = end.Value;

                if (begin.Value < 1)
                    be = 1;

                if (end.Value >= resultList.Count)
                    en = resultList.Count;

                int range = en - be + 1;

                resultList = resultList.GetRange(be - 1, range);
            }

            return Ok(resultList);
        }

        [HttpPost]
        public ActionResult AddOrUpdateEntry([FromBody] Entry entry)
        {
            Database.AddOrUpdateEntry(entry);

            return Ok("Ok!");
        }

        [HttpDelete]
        public ActionResult RemoveEntry([FromBody] Entry entry)
        {
            Database.RemoveEntry(entry);

            return Ok("Ok!");
        }

        [HttpGet("init")]
        public ActionResult ReloadEntries()
        {
            Database.LoadData();

            return Ok("Ok!");
        }
    }
}
