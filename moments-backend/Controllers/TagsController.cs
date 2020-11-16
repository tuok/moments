using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Moments.DTO;
using Newtonsoft.Json;

using Moments.Interfaces;

namespace Moments.Controllers
{
    [Route("api/tags")]
    public class TagsController : BaseController
    {
        public TagsController(IDatabase database) : base(database) {}

        public ActionResult Get([FromBody] TagParams parameters)
        {
            var searchTerm = parameters.SearchTerm?.ToLower();
            var limit = parameters.Limit;
            var freqs = parameters.Frequencies;

            var tagsFreqs = Database.TagsFrequencies.AsEnumerable();

            if (searchTerm != null)
            {
                tagsFreqs = tagsFreqs.Where(kvp => kvp.Key.Contains(searchTerm));
            }

            if (limit.HasValue && Database.TagsFrequencies.Count >= limit)
            {
                tagsFreqs = tagsFreqs.Take(limit.Value);
            }

            if (freqs.HasValue && freqs.Value)
                return Ok(tagsFreqs);
            else
                return Ok(tagsFreqs.Select(kvp => kvp.Key));
        }
    }
}
