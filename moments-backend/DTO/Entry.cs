using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace Moments.Models
{
    public class Entry : IComparable
    {
        private static Regex yRegex = new Regex(@"^\d{4}$", RegexOptions.Compiled);
        private static Regex myRegex = new Regex(@"^\d{1,2}\/\d{4}$", RegexOptions.Compiled);
        private static Regex dmyRegex = new Regex(@"^\d{1,2}\.\d{1,2}\.\d{4}", RegexOptions.Compiled);
        private static Regex dmyhRegex = new Regex(@"^\d{1,2}\.\d{1,2}\.\d{4} \d{1,2}:xx$", RegexOptions.Compiled);
        private static Regex dmyhmRegex = new Regex(@"^\d{1,2}\.\d{1,2}\.\d{4} \d{1,2}:\d{1,2}$", RegexOptions.Compiled);

        [JsonProperty("id")]
        public long Id { get; set; }
        [JsonProperty("author")]
        public string Author { get; set; }
        [JsonProperty("tags")]
        public List<string> Tags { get; set; }
        [JsonProperty("links_to")]
        public List<long> LinksTo { get; set; }
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
        public DateTime StartTime { get; set; }
        [JsonProperty("end_time")]
        public DateTime? EndTime { get; set; }
        [JsonIgnore]
        public string Path { get; set; }

        public Entry(
            long id,
            string author,
            string title,
            string text,
            bool privateEntry,
            List<string> tags,
            DateTime startTime,
            DateTime? endTime,
            List<long> linksTo = null
        ) {
            Id = id;
            Author = author;
            Title = title;
            Text = text;
            Private = privateEntry;
            Tags = tags;
            LinksTo = linksTo ?? new List<long>();
            StartTime = startTime;
            EndTime = endTime;
        }

        public int CompareTo(object e)
        {
            return StartTime.CompareTo(((Entry)e).StartTime);
        }

        public string GetPath()
        {
            var year = 9999;
            var month = 1;
            var day = 1;
            var hour = 0;
            var minute = 0;

            Func<string, (int, int)> myParse = str =>
            {
                var monthYear = StartReadableTimestamp
                    .Split("/")
                    .Select(Int32.Parse)
                    .ToArray();

                return (monthYear[0], monthYear[1]);
            };

            Func<string, (int, int, int)> dmyParse = str =>
            {
                var dayMonthYear = StartReadableTimestamp
                    .Split(".")
                    .Select(Int32.Parse)
                    .ToArray();

                return (dayMonthYear[0], dayMonthYear[1], dayMonthYear[2]);
            };

            Func<string, (int, int)> hmParse = str =>
            {
                var hourMinute = StartReadableTimestamp.Split(".");
                var tempHour = Int32.Parse(hourMinute[0]);

                if (!Int32.TryParse(hourMinute[1], out var tempMinute))
                    tempMinute = 0;

                return (tempHour, tempMinute);
            };

            if (yRegex.Match(StartReadableTimestamp).Success)
            {
                year = Int32.Parse(StartReadableTimestamp);
            }

            else if (myRegex.Match(StartReadableTimestamp).Success)
            {
                (month, year) = myParse(StartReadableTimestamp);
            }

            else if (dmyRegex.Match(StartReadableTimestamp).Success)
            {
                (day, month, year) = dmyParse(StartReadableTimestamp);
            }

            else if (dmyhRegex.Match(StartReadableTimestamp).Success || dmyhmRegex.Match(StartReadableTimestamp).Success)
            {
                var tokens = StartReadableTimestamp.Split(" ");

                (day, month, year) = dmyParse(tokens[0]);
                (hour, minute) = hmParse(tokens[1]);
            }

            string filename = $"{year:D4}{month:D2}{day:D2}-{hour:D2}{minute:D2}_{Id:D6}.json";
            string dir = System.IO.Path.Combine(year.ToString("D4"), month.ToString("D2"));
            string entryPath = System.IO.Path.Combine(dir, filename);

            return entryPath;
        }
    }
}