using System;
using System.Collections.Generic;

using Newtonsoft.Json;

namespace Moments.Models
{
    public class Entry : IComparable
    {
        [JsonProperty("id")]
        public long Id { get; }
        [JsonProperty("author")]
        public string Author { get; set; }
        [JsonProperty("tags")]
        public List<string> Tags { get; set; }
        [JsonProperty("links_to")]
        public List<long> LinksTo { get; set; }
        [JsonProperty("time_components")]
        public List<int?> TimeComponents { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
        [JsonProperty("private")]
        public bool Private { get; set; }

        [JsonIgnore]
        public string Path { get; set; }

        public Entry(
            long id,
            string author,
            string title,
            string text,
            bool privateEntry,
            List<string> tags,
            List<int?> timeComponents,
            List<long> linksTo = null
        )
        {
            Id = id;
            Author = author;
            Title = title;
            Text = text;
            Private = privateEntry;
            Tags = tags;
            TimeComponents = timeComponents;
            LinksTo = linksTo == null ? new List<long>() : linksTo;
        }

        public int CompareTo(object e)
        {
            return this.compareTimeComponents((Entry)e, 0);
        }

        private int compareTimeComponents(Entry e, int i)
        {
            if (i > 4)
            {
                if (Id < e.Id)
                    return -1;

                else if (Id > e.Id)
                    return 1;

                else
                    return 0;
            }

            if (TimeComponents[i].HasValue && !e.TimeComponents[i].HasValue)
                return 1;

            else if (!TimeComponents[i].HasValue && e.TimeComponents[i].HasValue)
                return -1;

            else if (!TimeComponents[i].HasValue && !e.TimeComponents[i].HasValue)
                return 0;

            else if (TimeComponents[i] < e.TimeComponents[i])
                return -1;

            else if (TimeComponents[i] > e.TimeComponents[i])
                return 1;

            else
            {
                return compareTimeComponents(e, i + 1);
            }
        }
    }
}