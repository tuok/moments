using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Moments.Interfaces;
using Moments.Models;

namespace Moments
{
    public class Database : IDatabase
    {
        private string path;
        private SortedDictionary<string, int> allTags;
        private SortedDictionary<long, Entry> allEntries;

        public List<Entry> Entries { get; private set; }
        public List<string> Tags { get { return allTags.Keys.ToList(); } }
        public Dictionary<string, int> TagsFrequencies { get { return new Dictionary<string, int>(allTags); } }
        public static long MaxId { private set; get; }

        private Regex entryRegex = new Regex("^[0-9]{8}-[0-9]{4}_[0-9]{6}[.]json$");

        public Database(string path)
        {
            allTags = new SortedDictionary<string, int>();
            allEntries = new SortedDictionary<long, Entry>();

            if (path[path.Length - 1] != '/')
                path += '/';

            this.path = path;

            if (!Directory.Exists(path))
                throw new IOException($"Specified path {path} doesn't exist. Cannot load entries.");
        }

        public Entry GetEntry(long id)
        {
            if (!this.allEntries.ContainsKey(id))
                return null;

            return this.allEntries[id];
        }

        // Adds new entry in memory, but doesn't save it.
        public Entry AddEntry(Entry entry)
        {
            entry.Id = ++MaxId;

            if (allEntries.ContainsKey(entry.Id))
                throw new ApplicationException("Something went very wrong, id for new entry already exists.");

            allEntries.Add(entry.Id, entry);
            this.sortEntries();

            return SaveEntry(entry);
        }

        // Method saves given entry. If Entry object doesn't have Path property assigned, new file
        // will be created. Otherwise existing path will be overwritten.
        public Entry SaveEntry(Entry entry)
        {
            // New entries do not have Path assigned, it must be generated
            if (entry.Path == null)
            {
                entry.Path = Path.Combine(this.path, this.generatePathForEntry(entry));
                Directory.CreateDirectory(Path.GetDirectoryName(entry.Path));
            }

            string content = JsonConvert.SerializeObject(entry, Formatting.Indented);
            File.WriteAllText(entry.Path, content);
            Console.WriteLine($"Entry #{entry.Id} was saved successfully in {entry.Path}");

            return entry;
        }

        public void RemoveEntry(Entry entry)
        {
            this.sortEntries();
            throw new NotImplementedException();
        }

        public void LoadData()
        {
            List<string> entryFileNames = this.GetEntryFiles().entryFiles;
            entryFileNames.Sort();
            this.parseEntries(entryFileNames);
            this.updateLinksToEntries();
            this.sortEntries();
        }

        private void sortEntries()
        {
            Entries = allEntries.Values.ToList();
            Entries.Sort((e1, e2) => e1.CompareTo(e2));
        }

        private (List<string> entryFiles, List<string> ignoredFiles) GetEntryFiles()
        {
            Console.WriteLine($"Browsing through path '{this.path}'...");

            List<string> entryFiles = new List<string>();
            List<string> ignoredFiles = new List<string>();

            foreach (var jsonFilePath in Directory.GetFiles(this.path, "*.json", SearchOption.AllDirectories))
            {
                string jsonFile = Path.GetFileName(jsonFilePath);

                if (entryRegex.IsMatch(jsonFile))
                    entryFiles.Add(jsonFilePath);

                else
                    ignoredFiles.Add(jsonFilePath);                
            }

            Console.WriteLine($"Browsing finished. Found {entryFiles.Count} entry candidates.");

            if (ignoredFiles.Count > 0)
            {
                Console.WriteLine("Ignored following files because their name didn't match expected pattern:");

                foreach (string file in ignoredFiles)
                    Console.WriteLine(file);
            }

            return (entryFiles, ignoredFiles);
        }

        private void parseEntries(List<string> entryFiles)
        {
            Dictionary<string, Exception> ignoredFiles = new Dictionary<string, Exception>();
            int entriesLoadedCount = 0;

            List<string> errors = new List<string>();

            foreach (string entryFile in entryFiles)
            {
                try
                {
                    string rawJson = File.ReadAllText(entryFile);

                    JsonSerializerSettings jss = new JsonSerializerSettings {
                        Error = delegate(object sender,  Newtonsoft.Json.Serialization.ErrorEventArgs args) {
                            Console.WriteLine(args.ErrorContext.Error.Message);
                        }
                    };

                    Entry entry = JsonConvert.DeserializeObject<Entry>(rawJson, jss);
                    entry.CreateTimestamps();

                    // Keep maximum ID number up to date
                    if (entry.Id > MaxId)
                        MaxId = entry.Id;

                    // Keep list of all tags updated
                    foreach (string tag in entry.Tags)
                    {
                        if (!allTags.ContainsKey(tag))
                            allTags.Add(tag, 1);
                        else
                            allTags[tag]++;
                    }

                    // Keep list of all entries updated
                    if (!allEntries.ContainsKey(entry.Id))
                        allEntries.Add(entry.Id, entry);

                    entriesLoadedCount++;

                    if (entriesLoadedCount % 100 == 0)
                        Console.WriteLine($"Loaded {entriesLoadedCount} entries...");
                }
                catch (Exception ex)
                {
                    ignoredFiles.Add(entryFile, ex);
                }
            }

            Console.WriteLine($"Loaded total of {entriesLoadedCount} entries.");


            if (ignoredFiles.Count > 0)
            {
                Console.WriteLine("Following files haven't been parsed because of exception:");

                foreach (var ignoredFile in ignoredFiles)
                {
                    Console.WriteLine($"{ignoredFile.Key} - {ignoredFile.Value.Message}");
                }
            }
        }

        private void updateLinksToEntries()
        {
            foreach (Entry entry in allEntries.Values)
            {
                foreach (long linkedEntry in entry.LinksTo)
                {
                    if (allEntries.ContainsKey(linkedEntry))
                    {
                        entry.LinksTo.Add(allEntries[linkedEntry].Id);
                        entry.LinksTo.Sort();
                    }
                    else
                        throw new ApplicationException($"Entry #{entry.Id} links to entry #{linkedEntry}, which doesn't exist.");
                }
            }
        }

        private string generatePathForEntry(Entry e)
        {
            int year = e.StartTimeComponents[0] ?? 9999;
            int month = e.StartTimeComponents[1] ?? 1;
            int day = e.StartTimeComponents[2] ?? 1;
            int hour = e.StartTimeComponents[3] ?? 0;
            int minute = e.StartTimeComponents[4] ?? 0;

            string filename = $"{year:D4}{month:D2}{day:D2}-{hour:D2}{minute:D2}_{e.Id:D6}.json";
            string dir = Path.Combine(year.ToString("D4"), month.ToString("D2"));
            string path = Path.Combine(dir, filename);

            return path;
        }
    }
}
