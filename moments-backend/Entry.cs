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
        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }

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

            CreateTimestamp();
        }

        public void CreateTimestamp()
        {
            int year = TimeComponents[0] ?? 9999;
            int month = TimeComponents[1] ?? 1;
            int day = TimeComponents[2] ?? 1;
            int hour = TimeComponents[3] ?? 0;
            int minute = TimeComponents[4] ?? 0;
            int second = 0;

            Timestamp = new DateTime(year, month, day, hour, minute, second);
        }

        public int CompareTo(object e)
        {
            return Timestamp.CompareTo(((Entry)e).Timestamp);
        }
    }
}