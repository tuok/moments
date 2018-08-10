using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moments.Interfaces;

using Newtonsoft.Json;

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
        [HttpGet]
        public string Get()
        {
            Console.WriteLine("EntryController: GET api/entry");
            return JsonConvert.SerializeObject(this.db.Entries);
        }

        // GET api/entries/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return this.db.GetEntry(id);
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
