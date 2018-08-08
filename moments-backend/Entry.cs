using System;
using System.Linq;
using System.Collections.Generic;

namespace Moments
{
    public class Entry
    {
        private static long maxId = 0;
        public static SortedDictionary<string, string> AllTags = new SortedDictionary<string, string>();
        public static SortedDictionary<long, Entry> AllEntries = new SortedDictionary<long, Entry>();

        public static long MaxId { get => maxId; }
        public List<string> GetAllTags() => AllTags.Values.ToList();


        public long Id { get; }
        public string Author { get; set; }
        public List<string> Tags { get; set; }
        public List<Entry> LinksTo { get; set; }
        //public DateTime Timestamp { get; set; }
        public List<int> TimeComponents { get; set; }
        public string Text { get; set; }
        public bool Private { get; set; }
        public string Path { get; set; }

        public Entry(
            long id,
            string author,
            string text,
            bool privateEntry,
            List<string> tags,
            List<long> linksTo,
            List<int> timeComponents
        )
        {
            // Keep list of all tags updated
            foreach (string tag in tags)
            {
                if (!AllTags.ContainsKey(tag))
                    AllTags.Add(tag, tag);
            }

            // Keep maximum ID number up to date
            if (id > maxId)
                maxId = id;

            Id = id;
            Author = author;
            Text = text;
            Private = privateEntry;
            Tags = tags;
            TimeComponents = timeComponents;

            foreach (long linkId in linksTo)
            {
                if (AllEntries.ContainsKey(linkId))
                    LinksTo.Add(AllEntries[linkId]);
            }

            // Timestamp is disabled for now, because it might not be needed at all:
            // 1. Time components are enough to unambiguously tell correct date/time.
            // 2. DateTime doesn't support partial times (only year or year + month etc.), so it can cause more confusion
            //    than benefit.
            /*
            Timestamp = new DateTime(
                timeComponents[0],
                timeComponents[1] == 0 ? 1 : timeComponents[1],
                timeComponents[2] == 0 ? 1 : timeComponents[2], // One, if real value is zero, otherwise real value
                timeComponents[3] == 0 ? 1 : timeComponents[3],
                timeComponents[4] == 0 ? 1 : timeComponents[4],
                0 // seconds
            );
            */
        }
    }
}