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
    [Route("api/tags")]
    public class TagsController : BaseController
    {
        public TagsController(IDatabase database) : base(database) {}

        public string Get([FromBody] TagParams parameters)
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
                return JsonConvert.SerializeObject(tagsFreqs);

            return JsonConvert.SerializeObject(tagsFreqs.Select(kvp => kvp.Key));
        }
    }
}
