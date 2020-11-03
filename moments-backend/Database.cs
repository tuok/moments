using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Moments.Interfaces;
using Moments.Models;

namespace Moments
{
    public class Database : IDatabase
    {
        private readonly string _path;
        private readonly SortedDictionary<string, int> _allTags;
        private readonly SortedDictionary<long, Entry> _allEntries;
        private static long MaxId { set; get; }

        public List<Entry> Entries { get; private set; }
        public List<string> Tags => _allTags.Keys.ToList();
        public Dictionary<string, int> TagsFrequencies => new Dictionary<string, int>(_allTags);

        private readonly Regex _entryRegex = new Regex("^[0-9]{8}-[0-9]{4}_[0-9]{6}[.]json$");

        public Database(string path)
        {
            _allTags = new SortedDictionary<string, int>();
            _allEntries = new SortedDictionary<long, Entry>();

            if (path[path.Length - 1] != '/')
                path += '/';

            _path = path;

            if (!Directory.Exists(path))
                throw new IOException($"Specified path {path} doesn't exist. Cannot load entries.");
        }

        public Entry GetEntry(long id)
        {
            if (!_allEntries.ContainsKey(id))
                return null;

            return _allEntries[id];
        }

        // Adds new entry in memory, but doesn't save it.
        public Entry AddEntry(Entry entry)
        {
            if (_allEntries.ContainsKey(MaxId + 1))
                throw new ApplicationException("Something went very wrong, id for new entry already exists.");

            if (entry.StartTime >= entry.EndTime)
                throw new InvalidDataException("Entry start time must come before end time.");

            entry.Id = ++MaxId;

            _allEntries.Add(entry.Id, entry);
            SortEntries();

            return SaveEntry(entry);
        }

        // Method saves given entry. If Entry object doesn't have Path property assigned, new file
        // will be created. Otherwise existing path will be overwritten.
        public Entry SaveEntry(Entry entry)
        {
            // New entries do not have Path assigned, it must be generated
            if (entry.Path == null)
            {
                entry.Path = Path.Combine(_path, entry.GetPath());
                Directory.CreateDirectory(Path.GetDirectoryName(entry.Path));
            }

            string content = JsonConvert.SerializeObject(entry, Formatting.Indented);
            File.WriteAllText(entry.Path, content);
            Console.WriteLine($"Entry #{entry.Id} was saved successfully in {entry.Path}");

            return entry;
        }

        public void RemoveEntry(Entry entry)
        {
            this.SortEntries();
            throw new NotImplementedException();
        }

        public void LoadData()
        {
            List<string> entryFileNames = GetEntryFiles().entryFiles;
            entryFileNames.Sort();
            ParseEntries(entryFileNames);
            UpdateLinksToEntries();
            SortEntries();
        }

        private void SortEntries()
        {
            Entries = _allEntries.Values.ToList();
            Entries.Sort((e1, e2) => e1.CompareTo(e2));
        }

        private (List<string> entryFiles, List<string> ignoredFiles) GetEntryFiles()
        {
            Console.WriteLine($"Browsing through path '{_path}'...");

            List<string> entryFiles = new List<string>();
            List<string> ignoredFiles = new List<string>();

            foreach (var jsonFilePath in Directory.GetFiles(_path, "*.json", SearchOption.AllDirectories))
            {
                string jsonFile = Path.GetFileName(jsonFilePath);

                if (_entryRegex.IsMatch(jsonFile))
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

        private void ParseEntries(List<string> entryFiles)
        {
            Dictionary<string, Exception> ignoredFiles = new Dictionary<string, Exception>();
            int entriesLoadedCount = 0;

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
                    entry.Path = entryFile;

                    // Keep maximum ID number up to date
                    if (entry.Id > MaxId)
                        MaxId = entry.Id;

                    // Keep list of all tags updated
                    foreach (string tag in entry.Tags)
                    {
                        if (!_allTags.ContainsKey(tag))
                            _allTags.Add(tag, 1);
                        else
                            _allTags[tag]++;
                    }

                    // Keep list of all entries updated
                    if (!_allEntries.ContainsKey(entry.Id))
                        _allEntries.Add(entry.Id, entry);

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

        private void UpdateLinksToEntries()
        {
            foreach (Entry entry in _allEntries.Values)
            {
                foreach (long linkedEntry in entry.LinksTo)
                {
                    if (_allEntries.ContainsKey(linkedEntry))
                    {
                        entry.LinksTo.Add(_allEntries[linkedEntry].Id);
                        entry.LinksTo.Sort();
                    }

                    else
                        throw new ApplicationException($"Entry #{entry.Id} links to entry #{linkedEntry}, which doesn't exist.");
                }
            }
        }

    }
}
