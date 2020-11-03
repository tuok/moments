using System.Collections.Generic;

namespace Moments.DTO
{
    public class EntryParams
    {
        public int? Id { get; set; }
        public string SearchTerm { get; set; }
        public List<string> Tags { get; set; }
        public int? Begin { get; set; }
        public int? End { get; set; }
    }
}