using System;
using System.Collections.Generic;

using Newtonsoft.Json;

namespace Moments.Models
{
    public class Entry
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
    }
}