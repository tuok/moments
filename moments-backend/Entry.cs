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
        [JsonProperty("start_time_components")]
        public List<int?> StartTimeComponents { get; set; }
        [JsonProperty("end_time_components")]
        public List<int?> EndTimeComponents { get; set; }
        [JsonProperty("start_readable_timestamp")]
        public string StartReadableTimestamp { get; set; }
        [JsonProperty("end_readable_timestamp")]
        public string EndReadableTimestamp { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
        [JsonProperty("private")]
        public bool Private { get; set; }
        [JsonProperty("start_time")]
        public DateTime? StartTime { get; set; }
        [JsonProperty("end_time")]
        public DateTime? EndTime { get; set; }

        public Entry(
            long id,
            string author,
            string title,
            string text,
            bool privateEntry,
            List<string> tags,
            List<int?> startTimeComponents,
            List<int?> endTimeComponents = null,
            List<long> linksTo = null
        ) {
            Id = id;
            Author = author;
            Title = title;
            Text = text;
            Private = privateEntry;
            Tags = tags;
            StartTimeComponents = startTimeComponents;
            EndTimeComponents = endTimeComponents;
            LinksTo = linksTo == null ? new List<long>() : linksTo;

            CreateTimestamps();
        }

        public void CreateTimestamps()
        {
            if (StartTimeComponents != null)
            {
                int year = StartTimeComponents[0] ?? 9999;
                int month = StartTimeComponents[1] ?? 1;
                int day = StartTimeComponents[2] ?? 1;
                int hour = StartTimeComponents[3] ?? 0;
                int minute = StartTimeComponents[4] ?? 0;
                int second = 0;

                StartTime = new DateTime(year, month, day, hour, minute, second);
            }

            if (EndTimeComponents != null)
            {
                int year = EndTimeComponents[0] ?? 9999;
                int month = EndTimeComponents[1] ?? 1;
                int day = EndTimeComponents[2] ?? 1;
                int hour = EndTimeComponents[3] ?? 0;
                int minute = EndTimeComponents[4] ?? 0;
                int second = 0;

                EndTime = new DateTime(year, month, day, hour, minute, second);
            }
        }

        public int CompareTo(object e)
        {
            return StartTime.Value.CompareTo(((Entry)e).StartTime.Value);
        }
    }
}